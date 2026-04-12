import React, { useState, useEffect } from "react";
import PathfindingVisualizer from "./PathfindingVisualizer.tsx";
import { PathfindingApiServiceImpl, PathfindingResponse } from "./utils/PathfindingAPIService.tsx";
import "./Pathfinding.css";

const apiService = new PathfindingApiServiceImpl();

const Pathfinding = () => {
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [algorithm, setAlgorithm] = useState("bfs-search");
  const [isSearching, setIsSearching] = useState(false);
  const [apiData, setApiData] = useState<PathfindingResponse | null>(null);

  // Initialize 32x32 empty grid
  useEffect(() => {
    const newGrid = Array(32).fill(0).map(() => Array(32).fill(0));
    setMatrix(newGrid);
  }, []);

  const handleStart = async () => {
    setIsSearching(true);
    setApiData(null);

    try {
      const response = await apiService.fetchPath(algorithm, {
        start: [0, 0],
        end: [31, 31],
        matrix: matrix
      });
      setApiData(response);
    } catch (error) {
      console.error("Search failed", error);
      setIsSearching(false);
    }
  };

  const toggleObstacle = (r: number, c: number) => {
    if (isSearching) return;
    const newGrid = [...matrix];
    newGrid[r][c] = newGrid[r][c] === 0 ? 1 : 0;
    setMatrix(newGrid);
  };

  return (
    <div className="pathfinder-container">
      <h1>Pathfinding Visualizer</h1>
      
      <PathfindingVisualizer 
        matrix={matrix}
        apiData={apiData}
        onComplete={() => setIsSearching(false)}
        onCellClick={toggleObstacle}
      />

      <div className="controls-section">
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="bfs-search">Breadth First Search</option>
          <option value="dfs-search">Depth First Search</option>
          <option value="astar-search">A* Search</option>
        </select>

        <button 
          onClick={handleStart} 
          disabled={isSearching}
          className="sort-button"
        >
          {isSearching ? "Searching..." : "Find Path"}
        </button>
        
        <button onClick={() => window.location.reload()} className="sort-button">
          Clear Grid
        </button>
      </div>
    </div>
  );
};

export default Pathfinding;