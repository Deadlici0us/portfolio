export class ArrayGenerator {
  static generateRandomArray(length = 99): number[] {
    const array = Array.from({ length }, (_, index) => index + 1);

    // Shuffle array using Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }

    return array;
  }
}
