export interface SortingApiService {
  fetchSortedData(
    algorithm: string,
    array: number[]
  ): Promise<{ steps: number[][]; indexes: number[] }>;
}

export class SortingApiServiceImpl implements SortingApiService {
  async fetchSortedData(
    algorithm: string,
    array: number[]
  ): Promise<{ steps: number[][]; indexes: number[] }> {
    const url = `https://api.anibal-flores.com/${algorithm}`; // Dynamic endpoint based on algorithm

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numbers: array }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching sorting data:", error);
      throw error;
    }
  }
}
