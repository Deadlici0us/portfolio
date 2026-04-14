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

const Pathfinding = () => {
  const { t } = useTranslation();
  // 1. Define Start and End points as constants or state
  const START_NODE: Point = [0, 0];
  const END_NODE: Point = [31, 31];

  const [matrix, setMatrix] = useState<number[][]>([]);
  const [algorithm, setAlgorithm] = useState('astar-search');
  const [isSearching, setIsSearching] = useState(false);
  const [apiData, setApiData] = useState<PathfindingResponse | null>(null);
  const [speed, setSpeed] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 2. Initialize the generator instance with our points
  // useMemo ensures we don't recreate the generator object on every render
  const generator = useMemo(
    () => new MatrixGenerator(START_NODE, END_NODE, 0.3),
    []
  );

  // 3. Use the generator to create the initial grid
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
      // 4. Pass the same points to the API service
      const response = await apiService.fetchPath(algorithm, {
        start: START_NODE,
        end: END_NODE,
        matrix: matrix,
      });
      setApiData(response);
    } catch (error: any) {
      console.error('Search failed', error);
      setError(error.message);
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
    <div>
      <h1>Pathfinding Visualizer</h1>

      <div className="visual-section">
        <div className="options-container">
          <div className="dropdown-container">
            <h4>{t('JPF-title')}</h4>
            <select
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

          <div className="speed-container">
            {/* Speed control */}
            <h4>{t('speed-title')}</h4>
            <input
              type="range"
              id="speed"
              name="speed"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <span>{speed}ms</span>
          </div>
          <div className="button-container">
            <button
              className="sort-button"
              onClick={handleStart}
              disabled={isSearching}
            >
              {isSearching ? t('pathfinding') : t('start-pathfinding')}
            </button>

            <button onClick={handleReset} className="sort-button">
              {t('new-matrix-button')}
            </button>
          </div>
          {loading && <div>{t('loading')}</div>}
          {error && <div>Error: {error}</div>}
        </div>
        <PathfindingVisualizer
          matrix={matrix}
          apiData={apiData}
          onComplete={() => setIsSearching(false)}
        />
      </div>
    </div>
  );
};

export default Pathfinding;
