export type Point = [number, number];
export type Matrix = number[][];

export class MatrixGenerator {
  static readonly SIZE = 32;
  
  // Injected properties
  private start: Point;
  private end: Point;
  private obstacleDensity: number;

  /**
   * @param start The starting [row, col] coordinates.
   * @param end The ending [row, col] coordinates.
   * @param obstacleDensity Percentage (0 to 1) of the non-path tiles to be obstacles.
   */
  constructor(
    start: Point = [0, 0],
    end: Point = [31, 31],
    obstacleDensity: number = 0.3
  ) {
    this.start = start;
    this.end = end;
    this.obstacleDensity = obstacleDensity;
  }

  /**
   * Generates a 32x32 matrix based on the injected instance parameters.
   */
  public generate(): Matrix {
    // 1. Initialize empty matrix
    const matrix: Matrix = Array.from({ length: MatrixGenerator.SIZE }, () =>
      Array(MatrixGenerator.SIZE).fill(-1)
    );

    // 2. Generate path using instance start/end points
    const pathPoints = this.generateRandomPath(this.start, this.end);
    
    pathPoints.forEach(([r, c]) => {
      matrix[r][c] = 0;
    });

    // 3. Fill obstacles based on instance density
    for (let r = 0; r < MatrixGenerator.SIZE; r++) {
      for (let c = 0; c < MatrixGenerator.SIZE; c++) {
        if (matrix[r][c] === -1) {
          matrix[r][c] = Math.random() < this.obstacleDensity ? 1 : 0;
        }
      }
    }

    return matrix;
  }

  private generateRandomPath(start: Point, end: Point): Point[] {
    const path: Point[] = [];
    let [currR, currC] = start;
    const [targetR, targetC] = end;

    path.push([currR, currC]);

    while (currR !== targetR || currC !== targetC) {
      const moveVertically = Math.random() > 0.5;

      if (moveVertically && currR !== targetR) {
        currR += currR < targetR ? 1 : -1;
      } else if (currC !== targetC) {
        currC += currC < targetC ? 1 : -1;
      } else {
        if (currR !== targetR) currR += currR < targetR ? 1 : -1;
        else currC += currC < targetC ? 1 : -1;
      }
      path.push([currR, currC]);
    }

    return path;
  }
}