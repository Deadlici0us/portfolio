import React, { useState, useEffect } from "react";
import "./SortingVisualizer.css";

interface SortingVisualizerProps {
  initialArray: number[];
  steps: number[][];
  indexes: number[][];
  speed: number;
  onSortingComplete: () => void;
}

function SortingVisualizer({
  initialArray,
  steps,
  indexes,
  speed,
  onSortingComplete,
}: SortingVisualizerProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [array, setArray] = useState<number[]>([]);
  const [highlightedIndexes, setHighlightedIndexes] = useState<number[]>([]);

  // Display initial array before sorting starts
  useEffect(() => {
    setArray(initialArray); // Show the initial unsorted array
    setCurrentStep(0); // Reset the current step
  }, [initialArray]);

  useEffect(() => {
    if (steps.length === 0) return; // Do nothing if no steps are provided

    const intervalId = setInterval(() => {
      if (currentStep < steps.length - 1) {
        // Highlight indexes and update array
        setHighlightedIndexes(indexes[currentStep]);
        setArray([...steps[currentStep + 1]]);
        setCurrentStep((prevStep) => prevStep + 1);
      } else {
        clearInterval(intervalId); // Stop interval when sorting completes
        setHighlightedIndexes([]); // Clear all highlights
        onSortingComplete(); // Notify parent
      }
    }, speed);

    return () => clearInterval(intervalId); // Cleanup on unmount or re-render
  }, [currentStep, steps, indexes, speed, onSortingComplete]);

  return (
    <div className='array-container'>
      {array.map((value, index) => (
        <div key={index} className={`array-bar-container`}>
          <div
            className={`array-bar ${
              highlightedIndexes.includes(index) ? "highlight" : ""
            }`}
            style={{ height: `${value * 2}px` }}></div>
        </div>
      ))}
    </div>
  );
}

export default SortingVisualizer;
