export type Point = [number, number];
export type Matrix = number[][];

export class MatrixGenerator {
  static readonly SIZE = 32;

  /**
   * Generates a 32x32 matrix with a guaranteed path and random obstacles.
   * @param start The starting [row, col] coordinates.
   * @param end The ending [row, col] coordinates.
   * @param obstacleDensity Percentage (0 to 1) of the non-path tiles to be obstacles.
   */
  static generate(
    start: Point = [1, 1],
    end: Point = [30, 30],
    obstacleDensity: number = 0.3
  ): Matrix {
    // 1. Initialize an empty 32x32 matrix filled with a placeholder (-1)
    const matrix: Matrix = Array.from({ length: this.SIZE }, () =>
      Array(this.SIZE).fill(-1)
    );

    // 2. Generate a random path from start to end
    const pathPoints = this.generateRandomPath(start, end);
    
    // Mark path points with 0
    pathPoints.forEach(([r, c]) => {
      matrix[r][c] = 0;
    });

    // 3. Fill the rest of the matrix
    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        // If it's not part of the path, decide if it's an obstacle (1) or clear (0)
        if (matrix[r][c] === -1) {
          matrix[r][c] = Math.random() < obstacleDensity ? 1 : 0;
        }
      }
    }

    return matrix;
  }

  /**
   * Creates a simple random walk path from start to end to ensure connectivity.
   */
  private static generateRandomPath(start: Point, end: Point): Point[] {
    const path: Point[] = [];
    let [currR, currC] = start;
    const [targetR, targetC] = end;

    path.push([currR, currC]);

    // Move step-by-step toward the target until we reach it
    while (currR !== targetR || currC !== targetC) {
      const moveVertically = Math.random() > 0.5;

      if (moveVertically && currR !== targetR) {
        currR += currR < targetR ? 1 : -1;
      } else if (currC !== targetC) {
        currC += currC < targetC ? 1 : -1;
      } else {
        // Fallback in case the random toggle picks a direction already aligned
        if (currR !== targetR) currR += currR < targetR ? 1 : -1;
        else currC += currC < targetC ? 1 : -1;
      }

      path.push([currR, currC]);
    }

    return path;
  }
}