/**
 * Deterministic colour for a scientific species name.
 *
 * Hashes `nombre_cientifico` to a hue so every species keeps a stable colour
 * across fetches, grid cells and sessions. Saturation/lightness are fixed to
 * stay readable on both light and dark themes.
 */
export function speciesColor(nombreCientifico: string): string {
  let hash = 0;
  for (let i = 0; i < nombreCientifico.length; i++) {
    hash = (hash * 31 + nombreCientifico.charCodeAt(i)) | 0;
  }
  const hue = ((hash % 360) + 360) % 360;
  return `hsl(${hue}, 68%, 46%)`;
}
