export interface ArbolResponse {
  nro_registro: number;
  nombre_cientifico: string;
  altura_arbol: number;
  diametro_altura_pecho: number;
  comuna: number;
  long: number;
  lat: number;
}

export interface ArbolSearchResponse {
  items: ArbolResponse[];
  total: number;
  truncated: boolean;
  normalizedLatitude: number;
  normalizedLongitude: number;
  radiusMeters: number;
}

export interface ArbolSearchApi {
  fetchTrees(latitude: number, longitude: number): Promise<ArbolSearchResponse>;
}

const SEARCH_URL = 'https://api.anibal-flores.com/BArboleda/search';

export class ArboledaApiServiceImpl implements ArbolSearchApi {
  async fetchTrees(
    latitude: number,
    longitude: number
  ): Promise<ArbolSearchResponse> {
    try {
      const response = await fetch(SEARCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      const text = await response.text();
      let data: unknown;
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

      if (!response.ok) {
        const message =
          typeof data === 'string'
            ? data
            : (data as { message?: string; error?: string; detail?: string })
                ?.message ||
              (data as { message?: string; error?: string; detail?: string })
                ?.detail ||
              (data as { message?: string; error?: string })?.error ||
              JSON.stringify(data);
        throw new Error(message || `HTTP error! status: ${response.status}`);
      }

      return data as ArbolSearchResponse;
    } catch (error) {
      console.error('Error fetching arbolado data:', error);
      throw error;
    }
  }
}

/**
 * Builds the session cache key for a center point.
 *
 * Mirrors the backend grid (`COORDINATE_SCALE = 3`, ~111m cells): any two centers
 * that share a key return identical data, so the second one must not hit the API.
 */
export function gridKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(3)}:${longitude.toFixed(3)}`;
}
