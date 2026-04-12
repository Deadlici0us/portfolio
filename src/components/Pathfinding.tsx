import React, { useState, useEffect, useMemo } from "react";
import PathfindingVisualizer from "./PathfindingVisualizer.tsx";
import { PathfindingApiServiceImpl, PathfindingResponse } from "./utils/PathfindingAPIService.tsx";
import { MatrixGenerator, Point } from "./utils/MatrixGenerator.tsx";
import "./Pathfinding.css";

const apiService = new PathfindingApiServiceImpl();

const Pathfinding = () => {
  // 1. Define Start and End points as constants or state
  const START_NODE: Point = [0, 0];
  const END_NODE: Point = [31, 31];

  const [matrix, setMatrix] = useState<number[][]>([]);
  const [algorithm, setAlgorithm] = useState("bfs-search");
  const [isSearching, setIsSearching] = useState(false);
  const [apiData, setApiData] = useState<PathfindingResponse | null>(null);

  // 2. Initialize the generator instance with our points
  // useMemo ensures we don't recreate the generator object on every render
  const generator = useMemo(() => 
    new MatrixGenerator(START_NODE, END_NODE, 0.3), 
  []);

  // 3. Use the generator to create the initial grid
  useEffect(() => {
    const newGrid = generator.generate();
    setMatrix(newGrid);
  }, [generator]);

  const handleStart = async () => {
    setIsSearching(true);
    setApiData(null);

    try {
      // 4. Pass the same points to the API service
      const response = await apiService.fetchPath(algorithm, {
        start: START_NODE,
        end: END_NODE,
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
    
    // Prevent toggling the start or end nodes into obstacles
    if ((r === START_NODE[0] && c === START_NODE[1]) || 
        (r === END_NODE[0] && c === END_NODE[1])) {
      return;
    }

    const newGrid = matrix.map((row, rowIndex) => 
      row.map((cell, colIndex) => {
        if (rowIndex === r && colIndex === c) {
          return cell === 0 ? 1 : 0;
        }
        return cell;
      })
    );
    setMatrix(newGrid);
  };

  const handleReset = () => {
    const newGrid = generator.generate();
    setMatrix(newGrid);
    setApiData(null);
    setIsSearching(false);
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
          <option value="dijkstra-search">Dijkstra's Algorithm</option>
        </select>

        <button 
          onClick={handleStart} 
          disabled={isSearching}
          className="sort-button"
        >
          {isSearching ? "Searching..." : "Find Path"}
        </button>
        
        <button onClick={handleReset} className="sort-button">
          New Random Grid
        </button>
      </div>
    </div>
  );
};

export default Pathfinding;