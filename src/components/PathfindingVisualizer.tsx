import React, { useState, useEffect } from 'react';
import { PathfindingResponse } from './utils/PathfindingAPIService';
import { Point } from './utils/MatrixGenerator';

interface Props {
  matrix: number[][];
  apiData: PathfindingResponse | null;
  speed: number;
  start: Point;
  end: Point;
  onComplete: () => void;
}

const PathfindingVisualizer = ({
  matrix,
  apiData,
  speed,
  start,
  end,
  onComplete,
}: Props) => {
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
        setExploredShown((prev) => new Set(prev).add(`${x},${y}`));
        i++;
      } else {
        clearInterval(explorationInterval);
        // 2. Animate Final Path
        animatePath();
      }
    }, speed); // Adjust speed here

    const animatePath = () => {
      const newPath = new Set<string>();
      apiData.result.forEach(([x, y]) => {
        newPath.add(`${x},${y}`);
      });
      setPathShown(newPath);
      onComplete();
    };

    return () => clearInterval(explorationInterval);
  }, [apiData, onComplete, speed]);

  const columns = matrix.length > 0 ? matrix[0].length : 0;

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {matrix.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const coord = `${cIdx},${rIdx}`; // API uses [x, y]
          let status = '';

          if (cIdx === start[0] && rIdx === start[1]) status = 'cell-start';
          else if (cIdx === end[0] && rIdx === end[1]) status = 'cell-end';
          else if (cell === 1) status = 'cell-obstacle';
          else if (pathShown.has(coord)) status = 'cell-path';
          else if (exploredShown.has(coord)) status = 'cell-explored';

          return <div key={coord} className={`cell ${status}`} />;
        })
      )}
    </div>
  );
};

export default PathfindingVisualizer;
