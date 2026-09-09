import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ArboledaMap, { ArboledaCenter } from './ArboledaMap.tsx';
import {
  ArboledaApiServiceImpl,
  ArbolSearchResponse,
  gridKey,
} from './utils/ArboledaApiService.tsx';
import { speciesColor } from './utils/ArboledaColors.tsx';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import './Arboleda.css';

const apiService = new ArboledaApiServiceImpl();

interface Landmark {
  key: 'planetario' | 'reserva' | 'alsina' | 'obelisco';
  lat: number;
  lon: number;
}

const LANDMARKS: Landmark[] = [
  { key: 'planetario', lat: -34.5697, lon: -58.4124 },
  { key: 'reserva', lat: -34.6185, lon: -58.3446 },
  { key: 'alsina', lat: -34.662, lon: -58.405 },
  { key: 'obelisco', lat: -34.6037, lon: -58.3816 },
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

  const trees = response?.items ?? [];

  return (
    <section className="visualizer-page">
      <header className="visualizer-header">
        <h1>{t('arboleda.title')}</h1>
        <p className="visualizer-subtitle">{t('arboleda.subtitle')}</p>
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
          <ArboledaMap center={center} trees={trees} colorFor={speciesColor} />
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
