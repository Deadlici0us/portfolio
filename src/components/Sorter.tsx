import React, { useEffect, useState } from 'react';
import SortingVisualizer from './SortingVisualizer.tsx';
import { SortingApiServiceImpl } from './utils/SortingAPIService.tsx';
import { ArrayGenerator } from './utils/ArrayGenerator.tsx';
import { useTranslation } from 'react-i18next';
import './Sorter.css';

const sortingApiService = new SortingApiServiceImpl();

function Sorter() {
  const { t } = useTranslation();
  const [data, setData] = useState({ steps: [], indexes: [] });
  const [array, setArray] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState<string>('bubble-sort');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    const randomArray = ArrayGenerator.generateRandomArray();
    setArray(randomArray);
  }, []);

  const handleStartSorting = async () => {
    setSorted(false);
    setLoading(true);
    setError(null);
    setIsSorting(true);

    try {
      const result = await sortingApiService.fetchSortedData(algorithm, array);
      setData({
        steps: result.steps,
        indexes: result.indexes,
      });
    } catch (err: any) {
      setError(err.message);
      setIsSorting(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSortingComplete = () => {
    setIsSorting(false);
    setSorted(true);
    setData({ steps: [], indexes: [] });
  };

  const handleGenerateNewArray = () => {
    const newArray = ArrayGenerator.generateRandomArray();
    handleSortingComplete();
    setSorted(false);
    setArray(newArray);
  };

  return (
    <section className="visualizer-page">
      <header className="visualizer-header">
        <h1>JSONSortFlow</h1>
        <p className="visualizer-subtitle">{t('sorter.subtitle')}</p>
      </header>

      <div className="visual-section panel">
        <div className="options-container">
          <div className="option-group">
            <label className="option-label" htmlFor="sorter-algorithm">
              {t('JSF-title')}
            </label>
            <select
              id="sorter-algorithm"
              className="selector"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={isSorting}
            >
              <option value="bubble-sort">Bubble Sort</option>
              <option value="merge-sort">Merge Sort</option>
              <option value="quick-sort">Quick Sort</option>
            </select>
          </div>

          <div className="option-group">
            <label className="option-label" htmlFor="sorter-speed">
              {t('speed-title')}
            </label>
            <div className="speed-row">
              <input
                type="range"
                id="sorter-speed"
                name="speed"
                min="1"
                max="500"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
              <output htmlFor="sorter-speed">{speed}ms</output>
            </div>
          </div>

          <div className="option-group">
            <span className="option-label">{t('curr-array-title')}</span>
            <code className="array-code">[{array.join(', ')}]</code>
          </div>

          <div className="button-row">
            <button
              className="btn btn-primary sort-button"
              onClick={handleStartSorting}
              disabled={loading || isSorting || sorted}
            >
              {sorted
                ? t('sorted')
                : isSorting
                  ? t('sorting')
                  : t('start-sorting')}
            </button>
            <button
              className="btn btn-secondary sort-button"
              onClick={handleGenerateNewArray}
              disabled={loading || isSorting}
            >
              {t('new-array-button')}
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

        <SortingVisualizer
          initialArray={array}
          steps={data.steps}
          indexes={data.indexes}
          speed={speed}
          onSortingComplete={handleSortingComplete}
        />
      </div>
    </section>
  );
}

export default Sorter;
