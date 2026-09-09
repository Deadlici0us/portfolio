import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import Supercluster from 'supercluster';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import type { ArbolResponse } from './utils/ArboledaApiService.tsx';

export interface ArboledaCenter {
  lat: number;
  lon: number;
}

interface ArboledaMapProps {
  center: ArboledaCenter;
  trees: ArbolResponse[];
  colorFor: (species: string) => string;
  selectedId?: number | null;
  onSelectTree?: (tree: ArbolResponse | null) => void;
}

type TreeFeature = GeoJSON.Feature<
  GeoJSON.Point,
  { tree: ArbolResponse; cluster?: false }
>;

const MIN_ZOOM = 14;
const MAX_ZOOM = 18;
const FOCUS_ZOOM = 15;
const BUCKET_RADIUS_METERS = 1000;
// Padded CABA bounds — the map can never leave the city area.
const MAX_BOUNDS = L.latLngBounds(
  L.latLng(-34.75, -58.58),
  L.latLng(-34.47, -58.28)
);

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Small viewports (mobile): details render as an inline card below the map,
// so markers select instead of opening an in-map popup that would cover it.
function isMobileMap(container: HTMLElement | null): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  if (window.matchMedia('(pointer: coarse)').matches) {
    return true;
  }
  return (container?.clientWidth ?? window.innerWidth) < 500;
}

function ArboledaMap({ center, trees, colorFor, selectedId = null, onSelectTree }: ArboledaMapProps) {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterLayerRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  const indexRef = useRef<Supercluster<{ tree: ArbolResponse }, {}> | null>(
    null
  );
  // nro_registro of the tree whose popup is currently open (null when closed).
  // Used to re-open it after a re-render so Leaflet autopan (moveend) can't kill it.
  const openTreeIdRef = useRef<number | null>(null);
  // Set on popupopen: the next moveend is the autopan settling, not the user
  // moving — skipping that one rebuild keeps the popup alive (no flicker).
  const isPopupPanningRef = useRef(false);
  // Last rendered viewport + index identity: skips duplicate renders
  // (zoomend + moveend fire together; setView with the same view).
  const lastRenderRef = useRef<{ key: string; index: object } | null>(null);
  // Latest render inputs for the Leaflet event callbacks (registered once).
  const liveRef = useRef({ trees, colorFor, t, language: i18n.language, selectedId, onSelectTree });
  liveRef.current = { trees, colorFor, t, language: i18n.language, selectedId, onSelectTree };

  const renderClusters = () => {
    const map = mapRef.current;
    const layer = clusterLayerRef.current;
    const index = indexRef.current;
    if (!map || !layer) {
      return;
    }
    if (!index) {
      return;
    }
    const zoom = map.getZoom();
    const { colorFor: color, t: translate, language } = liveRef.current;
    const bounds = map.getBounds();
    const renderKey =
      [
        bounds.getWest().toFixed(3),
        bounds.getSouth().toFixed(3),
        bounds.getEast().toFixed(3),
        bounds.getNorth().toFixed(3),
        zoom,
        language,
      ].join(',');
    const lastRender = lastRenderRef.current;
    if (
      lastRender !== null &&
      lastRender.key === renderKey &&
      lastRender.index === index
    ) {
      return;
    }
    // Autopan settling after a popup opened: keep existing markers so the
    // popup is not destroyed mid-animation (open-then-close flicker).
    if (isPopupPanningRef.current) {
      isPopupPanningRef.current = false;
      lastRenderRef.current = { key: renderKey, index };
      return;
    }
    lastRenderRef.current = { key: renderKey, index };
    layer.clearLayers();
    const clusters = index.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom
    );
    // Marker for the tree whose popup was open before the re-render (if still visible).
    let openMarker: L.CircleMarker | null = null;
    const openTreeId = openTreeIdRef.current;
    for (const feature of clusters) {
      const [lon, lat] = feature.geometry.coordinates;
      const props = feature.properties as
        | { cluster: true; cluster_id: number; point_count: number }
        | { tree: ArbolResponse };
      if ('cluster' in props && props.cluster) {
        const count = props.point_count;
        const size = count < 50 ? 34 : count < 200 ? 42 : 50;
        const marker = L.marker([lat, lon], {
          icon: L.divIcon({
            html: `<div class="arboleda-cluster" style="width:${size}px;height:${size}px;line-height:${size}px;">${count}</div>`,
            className: 'arboleda-cluster-wrap',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          }),
          keyboard: true,
          title: translate('arboleda.cluster.title', { count }),
        });
        const clusterId = props.cluster_id;
        const position: L.LatLngExpression = [lat, lon];
        marker.on('click', () => {
          const next = index.getClusterExpansionZoom(clusterId);
          map.setView(position, Math.min(next, MAX_ZOOM));
        });
        marker.addTo(layer);
      } else {
        const tree = (props as { tree: ArbolResponse }).tree;
        const fill = color(tree.nombre_cientifico);
        const mobile = isMobileMap(containerRef.current);
        const isSelected = mobile && liveRef.current.selectedId === tree.nro_registro;
        const marker = L.circleMarker([tree.lat, tree.long], {
          radius: isSelected ? 10 : 8,
          color: '#ffffff',
          weight: isSelected ? 2.5 : 1.5,
          fillColor: fill,
          fillOpacity: 0.92,
        });
        if (mobile) {
          marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            liveRef.current.onSelectTree?.(tree);
          });
          marker.addTo(layer);
          continue;
        }
        marker.bindPopup(
          `<div class="arboleda-popup">` +
            `<p class="arboleda-popup-species" style="border-left-color:${escapeHtml(fill)};">${escapeHtml(tree.nombre_cientifico)}</p>` +
            `<dl>` +
            `<div><dt>${escapeHtml(translate('arboleda.tree.registry'))}</dt><dd>${escapeHtml(tree.nro_registro)}</dd></div>` +
            `<div><dt>${escapeHtml(translate('arboleda.tree.height'))}</dt><dd>${escapeHtml(tree.altura_arbol)} m</dd></div>` +
            `<div><dt>${escapeHtml(translate('arboleda.tree.diameter'))}</dt><dd>${escapeHtml(tree.diametro_altura_pecho)} cm</dd></div>` +
            `<div><dt>${escapeHtml(translate('arboleda.tree.district'))}</dt><dd>${escapeHtml(tree.comuna)}</dd></div>` +
            `<div><dt>${escapeHtml(translate('arboleda.tree.coordinates'))}</dt><dd>${escapeHtml(tree.lat.toFixed(5))}, ${escapeHtml(tree.long.toFixed(5))}</dd></div>` +
            `</dl></div>`,
          {
            closeButton: true,
            autoPan: true,
            autoPanPadding: L.point(20, 20),
            maxWidth: 260,
            keepInView: false,
            closeOnClick: false,
          }
        );
        marker.on('popupopen', () => {
          openTreeIdRef.current = tree.nro_registro;
          isPopupPanningRef.current = true;
        });
        marker.on('popupclose', () => {
          if (openTreeIdRef.current === tree.nro_registro) {
            openTreeIdRef.current = null;
          }
        });
        if (tree.nro_registro === openTreeId) {
          openMarker = marker;
        }
        marker.addTo(layer);
      }
    }
    // The open popup's marker was just rebuilt (clearLayers above): re-open it so
    // the autopan-triggered moveend that destroyed it doesn't read as a flicker.
    // Autopan is already settled at this point, so this converges after one pass.
    if (openMarker !== null) {
      openMarker.openPopup();
    }
  };

  // Init once (StrictMode-safe via cleanup).
  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }
    const map = L.map(containerRef.current, {
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      maxBounds: MAX_BOUNDS,
      maxBoundsViscosity: 1.0,
      closePopupOnClick: false,
    }).setView([center.lat, center.lon], FOCUS_ZOOM);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: MAX_ZOOM,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    clusterLayerRef.current = L.layerGroup().addTo(map);
    userLayerRef.current = L.layerGroup().addTo(map);
    map.on('moveend zoomend', renderClusters);
    const deselectOnBackgroundTap = () => {
      if (isMobileMap(containerRef.current)) {
        liveRef.current.onSelectTree?.(null);
      }
    };
    map.on('click', deselectOnBackgroundTap);
    mapRef.current = map;
    return () => {
      map.off('moveend zoomend', renderClusters);
      map.off('click', deselectOnBackgroundTap);
      map.remove();
      mapRef.current = null;
      clusterLayerRef.current = null;
      userLayerRef.current = null;
      indexRef.current = null;
      openTreeIdRef.current = null;
      isPopupPanningRef.current = false;
      lastRenderRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow landmark / GPS selections: recenter, redraw user pin + 1000m circle.
  useEffect(() => {
    const map = mapRef.current;
    const layer = userLayerRef.current;
    if (!map || !layer) {
      return;
    }
    map.setView([center.lat, center.lon], Math.max(map.getZoom(), FOCUS_ZOOM));
    layer.clearLayers();
    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim() || '#4f46e5';
    L.circle([center.lat, center.lon], {
      radius: BUCKET_RADIUS_METERS,
      color: accent,
      weight: 1.5,
      dashArray: '6 6',
      fillColor: accent,
      fillOpacity: 0.05,
      interactive: false,
    }).addTo(layer);
    L.circleMarker([center.lat, center.lon], {
      radius: 8,
      color: '#ffffff',
      weight: 2,
      fillColor: accent,
      fillOpacity: 1,
      interactive: false,
    }).addTo(layer);
  }, [center.lat, center.lon]);

  // Rebuild the cluster index on every new bucket (always clustered, any size).
  useEffect(() => {
    const index = new Supercluster<{ tree: ArbolResponse }, {}>({
      radius: 40,
      maxZoom: 16,
    });
    const points: TreeFeature[] = trees.map((tree) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [tree.long, tree.lat],
      },
      properties: { tree },
    }));
    index.load(points);
    indexRef.current = index;
    // New dataset: the previously open tree is gone, drop it instead of
    // re-opening a same-id marker unprompted on a later render.
    openTreeIdRef.current = null;
    isPopupPanningRef.current = false;
    mapRef.current?.closePopup();
    renderClusters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trees]);

  // Refresh the selected-marker highlight (mobile inline card, no popups).
  useEffect(() => {
    renderClusters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return (
    <div
      ref={containerRef}
      className="arboleda-map"
      role="application"
      aria-label={t('arboleda.map.label')}
    />
  );
}

export default ArboledaMap;
