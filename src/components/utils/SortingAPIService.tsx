export interface SortingApiService {
  fetchSortedData(
    algorithm: string,
    array: number[]
  ): Promise<{ steps: number[][]; indexes: number[][] }>;
}

export class SortingApiServiceImpl implements SortingApiService {
  async fetchSortedData(
    algorithm: string,
    array: number[]
  ): Promise<{ steps: number[][]; indexes: number[][] }> {
    const url = `https://api.anibal-flores.com/${algorithm}`; // Dynamic endpoint based on algorithm

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ numbers: array }),
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
        throw new Error(message || `HTTP error! status: ${response.status}`);
      }

      // Endpoint always returns JSON object { steps, indexes }, never a raw string.
      // Handle both object and double-stringified cases defensively.
      return data as { steps: number[][]; indexes: number[][] };
    } catch (error) {
      console.error('Error fetching sorting data:', error);
      throw error;
    }
  }
}
