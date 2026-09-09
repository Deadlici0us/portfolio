import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ArboledaMap, { ArboledaCenter } from './ArboledaMap.tsx';
import {
  ArboledaApiServiceImpl,
  ArbolResponse,
  ArbolSearchResponse,
  gridKey,
} from './utils/ArboledaApiService.tsx';
import { speciesColor } from './utils/ArboledaColors.tsx';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import './Arboleda.css';

const apiService = new ArboledaApiServiceImpl();

const SWAGGER_UI_URL = 'https://api.anibal-flores.com/BArboleda/swagger-ui/index.html';
const OPENAPI_URL = 'https://api.anibal-flores.com/BArboleda/v3/api-docs';

interface Landmark {
  key: 'obelisco' | 'universitaria' | 'japones' | 'botanico';
  lat: number;
  lon: number;
}

const LANDMARKS: Landmark[] = [
  { key: 'obelisco', lat: -34.6037, lon: -58.3816 },
  { key: 'universitaria', lat: -34.5414, lon: -58.4431 },
  { key: 'japones', lat: -34.5753, lon: -58.4094 },
  { key: 'botanico', lat: -34.5825, lon: -58.4174 },
];

type GpsState = 'idle' | 'locating' | 'denied' | 'unavailable';

function Arboleda() {
  const { t } = useTranslation();
  const [center, setCenter] = useState<ArboledaCenter>({
    lat: LANDMARKS[0].lat,
    lon: LANDMARKS[0].lon,
  });
  const [activeKey, setActiveKey] = useState<string>(LANDMARKS[0].key);
  const [response, setResponse] = useState<ArbolSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gpsState, setGpsState] = useState<GpsState>('idle');
  const [selectedTree, setSelectedTree] = useState<ArbolResponse | null>(null);
  const [legendOpen, setLegendOpen] = useState(
    () => typeof window === 'undefined' || window.innerWidth >= 832
  );
  const cacheRef = useRef(new Map<string, ArbolSearchResponse>());
  const seqRef = useRef(0);

  const load = useCallback(async (lat: number, lon: number, key: string) => {
    const seq = ++seqRef.current;
    const key3 = gridKey(lat, lon);
    setCenter({ lat, lon });
    setActiveKey(key);
    setError(null);
    setSelectedTree(null);
    const cached = cacheRef.current.get(key3);
    if (cached) {
      setResponse(cached);
      return;
    }
    setLoading(true);
    try {
      const data = await apiService.fetchTrees(lat, lon);
      if (seqRef.current !== seq) {
        return;
      }
      cacheRef.current.set(key3, data);
      // Also file under the backend-normalized grid key (same ~111m cell).
      cacheRef.current.set(
        gridKey(data.normalizedLatitude, data.normalizedLongitude),
        data
      );
      setResponse(data);
    } catch (err: any) {
      if (seqRef.current !== seq) {
        return;
      }
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : JSON.stringify(err);
      setError(message);
    } finally {
      if (seqRef.current === seq) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    load(LANDMARKS[0].lat, LANDMARKS[0].lon, LANDMARKS[0].key);
  }, [load]);

  const handleGps = () => {
    if (!('geolocation' in navigator)) {
      setGpsState('unavailable');
      return;
    }
    setGpsState('locating');
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsState('idle');
        load(pos.coords.latitude, pos.coords.longitude, 'gps');
      },
      (err) => {
        setGpsState(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable');
      },
      { timeout: 10000 }
    );
  };

  const handleSelectTree = useCallback((tree: ArbolResponse | null) => {
    setSelectedTree(tree);
  }, []);

  const trees = useMemo(() => response?.items ?? [], [response]);

  // Drop the selection when a new bucket no longer contains the tree.
  useEffect(() => {
    if (selectedTree === null) {
      return;
    }
    const stillVisible = trees.some((item) => item.nro_registro === selectedTree.nro_registro);
    if (!stillVisible) {
      setSelectedTree(null);
    }
  }, [trees, selectedTree]);

  // Escape clears the inline selection (mobile card).
  useEffect(() => {
    if (selectedTree === null) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedTree(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedTree]);

  const species = useMemo(() => {
    if (!response) {
      return [];
    }
    const counts = new Map<string, number>();
    for (const tree of response.items) {
      counts.set(
        tree.nombre_cientifico,
        (counts.get(tree.nombre_cientifico) ?? 0) + 1
      );
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [response]);

  return (
    <section className="visualizer-page">
      <header className="visualizer-header">
        <h1>{t('arboleda.title')}</h1>
        <p className="visualizer-subtitle">{t('arboleda.subtitle')}</p>
        <div className="arboleda-docs">
          <a className="text-link" href={SWAGGER_UI_URL} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faBook} aria-hidden="true" />
            <span>{t('arboleda.docs.swagger')}</span>
          </a>
          <a className="text-link" href={OPENAPI_URL} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faBook} aria-hidden="true" />
            <span>{t('arboleda.docs.openapi')}</span>
          </a>
        </div>
      </header>

      <div className="visual-section panel arboleda-section">
        <div className="options-container">
          <div className="option-group">
            <span className="option-label" id="arboleda-landmarks-label">
              {t('arboleda.landmarks.label')}
            </span>
            <div
              className="arboleda-landmarks"
              role="group"
              aria-labelledby="arboleda-landmarks-label"
            >
              {LANDMARKS.map((landmark) => (
                <button
                  key={landmark.key}
                  className={`btn visualizer-button ${activeKey === landmark.key ? 'btn-primary' : 'btn-secondary'}`}
                  aria-pressed={activeKey === landmark.key}
                  onClick={() => load(landmark.lat, landmark.lon, landmark.key)}
                >
                  {t(`arboleda.landmarks.${landmark.key}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <span className="option-label">{t('arboleda.gps.label')}</span>
            <button
              className={`btn visualizer-button ${activeKey === 'gps' ? 'btn-primary' : 'btn-secondary'}`}
              aria-pressed={activeKey === 'gps'}
              onClick={handleGps}
              disabled={gpsState === 'locating'}
            >
              <FontAwesomeIcon icon={faLocationCrosshairs} aria-hidden="true" />
              {gpsState === 'locating'
                ? t('arboleda.gps.locating')
                : t('arboleda.gps.button')}
            </button>
            {gpsState === 'denied' && (
              <p className="status-message status-error" role="alert">
                {t('arboleda.gps.denied')}
              </p>
            )}
            {gpsState === 'unavailable' && (
              <p className="status-message status-error" role="alert">
                {t('arboleda.gps.unavailable')}
              </p>
            )}
          </div>

          <div className="option-group">
            <span className="option-label">{t('arboleda.stats.label')}</span>
            {loading && (
              <p className="status-message" role="status">
                {t('arboleda.loading')}
              </p>
            )}
            {error && (
              <p className="status-message status-error" role="alert">
                Error: {error}
              </p>
            )}
            {!loading && !error && response && (
              <p className="status-message" role="status">
                {t('arboleda.stats.count', { count: response.total })}
                {' · '}
                <code className="arboleda-grid">
                  {gridKey(center.lat, center.lon)}
                </code>
              </p>
            )}
            {!loading && !error && response?.truncated && (
              <p className="status-message status-error" role="alert">
                {t('arboleda.truncatedWarning')}
              </p>
            )}
            {!loading && !error && response && response.total === 0 && (
              <p className="status-message" role="status">
                {t('arboleda.empty')}
              </p>
            )}
          </div>
        </div>

        <div className="arboleda-map-wrap">
          <ArboledaMap
            center={center}
            trees={trees}
            colorFor={speciesColor}
            selectedId={selectedTree?.nro_registro ?? null}
            onSelectTree={handleSelectTree}
          />
          {selectedTree && (
            <div className="arboleda-selected" role="status" aria-live="polite">
              <div className="arboleda-selected-header">
                <span className="option-label">{t('arboleda.selected.title')}</span>
                <button
                  className="btn btn-secondary arboleda-selected-close"
                  onClick={() => setSelectedTree(null)}
                  aria-label={t('arboleda.selected.close')}
                >
                  ×
                </button>
              </div>
              <p
                className="arboleda-popup-species"
                style={{ borderLeftColor: speciesColor(selectedTree.nombre_cientifico) }}
              >
                {selectedTree.nombre_cientifico}
              </p>
              <dl>
                <div>
                  <dt>{t('arboleda.tree.registry')}</dt>
                  <dd>{selectedTree.nro_registro}</dd>
                </div>
                <div>
                  <dt>{t('arboleda.tree.height')}</dt>
                  <dd>{selectedTree.altura_arbol} m</dd>
                </div>
                <div>
                  <dt>{t('arboleda.tree.diameter')}</dt>
                  <dd>{selectedTree.diametro_altura_pecho} cm</dd>
                </div>
                <div>
                  <dt>{t('arboleda.tree.district')}</dt>
                  <dd>{selectedTree.comuna}</dd>
                </div>
                <div>
                  <dt>{t('arboleda.tree.coordinates')}</dt>
                  <dd>
                    {selectedTree.lat.toFixed(5)}, {selectedTree.long.toFixed(5)}
                  </dd>
                </div>
              </dl>
            </div>
          )}
          <div className="arboleda-legend">
            <button
              className="btn btn-secondary arboleda-legend-toggle"
              aria-expanded={legendOpen}
              onClick={() => setLegendOpen((open) => !open)}
            >
              {legendOpen ? t('arboleda.legend.hide') : t('arboleda.legend.show')}
              {species.length > 0 && ` (${species.length})`}
            </button>
            {legendOpen && species.length > 0 && (
              <ul className="arboleda-legend-list">
                {species.map(([name, count]) => (
                  <li key={name} className="arboleda-legend-item">
                    <i
                      className="legend-swatch"
                      style={{ backgroundColor: speciesColor(name) }}
                      aria-hidden="true"
                    />
                    <span className="arboleda-legend-name">{name}</span>
                    <span className="arboleda-legend-count">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Arboleda;
