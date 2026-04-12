import React, { useState, useEffect } from "react";
import { PathfindingResponse } from "./utils/PathfindingAPIService";

interface Props {
  matrix: number[][];
  apiData: PathfindingResponse | null;
  onComplete: () => void;
  onCellClick: (r: number, c: number) => void;
}

const PathfindingVisualizer = ({ matrix, apiData, onComplete, onCellClick }: Props) => {
  const [exploredShown, setExploredShown] = useState<Set<string>>(new Set());
  const [pathShown, setPathShown] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!apiData) {
      setExploredShown(new Set());
      setPathShown(new Set());
      return;
    }

    let i = 0;
    // 1. Animate Explored Nodes
    const explorationInterval = setInterval(() => {
      if (i < apiData.explored.length) {
        const [x, y] = apiData.explored[i];
        setExploredShown(prev => new Set(prev).add(`${x},${y}`));
        i++;
      } else {
        clearInterval(explorationInterval);
        // 2. Animate Final Path
        animatePath();
      }
    }, 10); // Adjust speed here

    const animatePath = () => {
      let j = 0;
      const pathInterval = setInterval(() => {
        if (j < apiData.result.length) {
          const [x, y] = apiData.result[j];
          setPathShown(prev => new Set(prev).add(`${x},${y}`));
          j++;
        } else {
          clearInterval(pathInterval);
          onComplete();
        }
      }, 30);
    };

    return () => clearInterval(explorationInterval);
  }, [apiData]);

  return (
    <div className="grid">
      {matrix.map((row, rIdx) => 
        row.map((cell, cIdx) => {
          const coord = `${cIdx},${rIdx}`; // API uses [x, y]
          let status = "";
          
          if (cIdx === 0 && rIdx === 0) status = "cell-start";
          else if (cIdx === 31 && rIdx === 31) status = "cell-end";
          else if (cell === 1) status = "cell-obstacle";
          else if (pathShown.has(coord)) status = "cell-path";
          else if (exploredShown.has(coord)) status = "cell-explored";

          return (
            <div 
              key={coord} 
              className={`cell ${status}`} 
              onClick={() => onCellClick(rIdx, cIdx)}
            />
          );
        })
      )}
    </div>
  );
};

export default PathfindingVisualizer;