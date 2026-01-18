import React, { useEffect, useState } from "react";
import SortingVisualizer from "./SortingVisualizer.tsx";
import { SortingApiServiceImpl } from "./utils/SortingAPIService.tsx";
import { ArrayGenerator } from "./utils/ArrayGenerator.tsx";
import { useTranslation } from "react-i18next";
import "./Sorter.css";

const sortingApiService = new SortingApiServiceImpl();

function Sorter() {
  const { t } = useTranslation();
  const [data, setData] = useState({ steps: [], indexes: [] });
  const [array, setArray] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState<string>("bubble-sort");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [sorted, setSorted] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const randomArray = ArrayGenerator.generateRandomArray();
    setArray(randomArray);
  }, []);

  // Fetch sorting steps based on the algorithm
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
    <div>
      <h1>JSONSortFlow</h1>
      <div className='visual-section'>
        <div className='options-container'>
          <div className='dropdown-container'>
            <h4>{t("JSF-title")}</h4>
            {/* Dropdown for selecting algorithm */}
            <select
              className='selector'
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={isSorting}>
              <option value='bubble-sort'>Bubble Sort</option>
              <option value='merge-sort'>Merge Sort</option>
              <option value='quick-sort'>Quick Sort</option>
              {/* Add more sorting algorithms */}
            </select>
          </div>
          <div className='speed-container'>
            {/* Speed control */}
            <h4>{t("speed-title")}</h4>
            <input
              type='range'
              id='speed'
              name='speed'
              min='1'
              max='500'
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <span>{speed}ms</span>
          </div>
          <div className='current-container'>
            {/* Display current array */}
            <h4>{t("curr-array-title")}</h4>
            <div>[{array.join(", ")}]</div>
          </div>

          {/* Sorting and Array Generation Buttons */}

          <div className='button-container'>
            <button
              className='sort-button'
              onClick={handleStartSorting}
              disabled={loading || isSorting || sorted}>
              {sorted
                ? t("sorted")
                : isSorting
                ? t("sorting")
                : t("start-sorting")}
            </button>
            <button
              className='sort-button'
              onClick={handleGenerateNewArray}
              disabled={loading || isSorting}>
              {t("new-array-button")}
            </button>
          </div>
          {/* Error and Loading States */}
          {loading && <div>{t("loading")}</div>}
          {error && <div>Error: {error}</div>}
        </div>

        {/* Visualizer */}
        <SortingVisualizer
          initialArray={array}
          steps={data.steps}
          indexes={data.indexes}
          speed={speed}
          onSortingComplete={handleSortingComplete}
        />
      </div>
    </div>
  );
}

export default Sorter;
