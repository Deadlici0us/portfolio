export interface PathfindingRequest {
  start: [number, number];
  end: [number, number];
  matrix: number[][];
}

export interface PathfindingResponse {
  explored: [number, number][];
  result: [number, number][];
}

export interface PathfindingApiService {
  fetchPath(
    algorithm: string,
    requestData: PathfindingRequest
  ): Promise<PathfindingResponse>;
}

export class PathfindingApiServiceImpl implements PathfindingApiService {
  private readonly baseUrl = "https://api.anibal-flores.com";

  /**
   * Fetches pathfinding data from the local search API.
   * @param algorithm - The specific endpoint (e.g., 'bfs-search', 'dfs-search', 'astar-search')
   * @param requestData - Object containing start, end, and the 32x32 matrix
   */
  async fetchPath(
    algorithm: string,
    requestData: PathfindingRequest
  ): Promise<PathfindingResponse> {
    const url = `${this.baseUrl}/${algorithm}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Pathfinding API error! Status: ${response.status}`);
      }

      return (await response.json()) as PathfindingResponse;
    } catch (error) {
      console.error("Error fetching pathfinding data:", error);
      throw error;
    }
  }
}