import React, { useState, useEffect, useMemo } from 'react';
import PathfindingVisualizer from './PathfindingVisualizer.tsx';
import {
  PathfindingApiServiceImpl,
  PathfindingResponse,
} from './utils/PathfindingAPIService.tsx';
import { MatrixGenerator, Point } from './utils/MatrixGenerator.tsx';
import { useTranslation } from 'react-i18next';
import './Pathfinding.css';

const apiService = new PathfindingApiServiceImpl();

const START_NODE: Point = [0, 0];
const END_NODE: Point = [31, 31];

const Pathfinding = () => {
  const { t } = useTranslation();

  const [matrix, setMatrix] = useState<number[][]>([]);
  const [algorithm, setAlgorithm] = useState('astar-search');
  const [isSearching, setIsSearching] = useState(false);
  const [apiData, setApiData] = useState<PathfindingResponse | null>(null);
  const [speed, setSpeed] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generator = useMemo(
    () => new MatrixGenerator(START_NODE, END_NODE, 0.3),
    []
  );

  const handleComplete = useMemo(() => () => setIsSearching(false), []);

  useEffect(() => {
    const newGrid = generator.generate();
    setMatrix(newGrid);
  }, [generator]);

  const handleStart = async () => {
    setIsSearching(true);
    setApiData(null);
    setError(null);
    setLoading(true);

    try {
      const response = await apiService.fetchPath(algorithm, {
        start: START_NODE,
        end: END_NODE,
        matrix: matrix,
      });
      // Endpoint returns JSON object { explored, result } — handle as object directly.
      setApiData(response);
    } catch (error: any) {
      console.error('Search failed', error);
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : error?.message
              ? String(error.message)
              : JSON.stringify(error);
      setError(message);
      setIsSearching(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsSearching(false);
    setApiData(null);
    const newGrid = generator.generate();
    setMatrix(newGrid);
  };

  return (
    <section className="visualizer-page">
      <header className="visualizer-header">
        <h1>Pathfinding Visualizer</h1>
        <p className="visualizer-subtitle">{t('pathfinding.subtitle')}</p>
      </header>

      <div className="visual-section panel">
        <div className="options-container">
          <div className="option-group">
            <label className="option-label" htmlFor="pf-algorithm">
              {t('JPF-title')}
            </label>
            <select
              id="pf-algorithm"
              className="selector"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="astar-search">A* Search</option>
              <option value="bfs-search">Breadth First Search</option>
              <option value="dfs-search">Depth First Search</option>
              <option value="dijkstra-search">Dijkstra's Algorithm</option>
            </select>
          </div>

          <div className="option-group">
            <label className="option-label" htmlFor="pf-speed">
              {t('speed-title')}
            </label>
            <div className="speed-row">
              <input
                type="range"
                id="pf-speed"
                name="speed"
                min="1"
                max="10"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
              <output htmlFor="pf-speed">{speed}ms</output>
            </div>
          </div>

          <div className="grid-legend" aria-hidden="true">
            <span className="legend-item">
              <i className="legend-swatch cell-start" />
              Start
            </span>
            <span className="legend-item">
              <i className="legend-swatch cell-end" />
              End
            </span>
            <span className="legend-item">
              <i className="legend-swatch cell-obstacle" />
              Wall
            </span>
            <span className="legend-item">
              <i className="legend-swatch cell-explored" />
              Explored
            </span>
            <span className="legend-item">
              <i className="legend-swatch cell-path" />
              Path
            </span>
          </div>

          <div className="button-row">
            <button
              className="btn btn-primary sort-button"
              onClick={handleStart}
              disabled={isSearching}
            >
              {isSearching ? t('pathfinding.searching') : t('start-pathfinding')}
            </button>

            <button
              onClick={handleReset}
              className="btn btn-secondary sort-button"
            >
              {t('new-matrix-button')}
            </button>
          </div>

          {loading && (
            <p className="status-message" role="status">
              {t('loading')}
            </p>
          )}
          {error && (
            <p className="status-message status-error" role="alert">
              Error: {error}
            </p>
          )}
        </div>
        <PathfindingVisualizer
          matrix={matrix}
          apiData={apiData}
          speed={speed}
          onComplete={handleComplete}
        />
      </div>
    </section>
  );
};

export default Pathfinding;
