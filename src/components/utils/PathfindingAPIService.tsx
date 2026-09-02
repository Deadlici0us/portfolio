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
  private readonly baseUrl = 'https://api.anibal-flores.com';

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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: unknown;

      if (contentType.includes('application/json')) {
        const text = await response.text();
        try {
          data = JSON.parse(text);
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data as string);
            } catch {
              // keep as string if inner parse fails
            }
          }
        } catch {
          data = text;
        }
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data as string);
            } catch {
              // keep
            }
          }
        } catch {
          data = text;
        }
      }

      if (!response.ok) {
        const message =
          typeof data === 'string'
            ? data
            : (data as { message?: string; error?: string })?.message ||
              (data as { message?: string; error?: string })?.error ||
              JSON.stringify(data);
        throw new Error(
          message || `Pathfinding API error! Status: ${response.status}`
        );
      }

      // Endpoint always returns JSON object { explored, result }, never a raw string.
      // Handle both object and double-stringified cases defensively.
      return data as PathfindingResponse;
    } catch (error) {
      console.error('Error fetching pathfinding data:', error);
      throw error;
    }
  }
}
