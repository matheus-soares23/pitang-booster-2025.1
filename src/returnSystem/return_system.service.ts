import { entryPairDto } from "./dto/entrypair.dto";
export class returnSystemService {
  async result(numberInterval: entryPairDto) {
    const { numbers, operation } = numberInterval;
    const pairNumbers = this.getPairNumbers(numbers);
    const oddNumbers = this.getOddNumbers(numbers);
    const sum = this.getSum(numbers);
    const average = this.getAverage(numbers);

    switch (operation) {
      case "sum":
        return sum;
      case "average":
        return average;
      case "pair-numbers":
        return pairNumbers;
      case "odd-numbers":
        return oddNumbers;
      default:
        return { sum, average, pairNumbers, oddNumbers };
    }
  }

  getPairNumbers = (numbers: number[]): number[] => {
    return numbers.filter((num) => num % 2 === 0);
  };

  getOddNumbers = (numbers: number[]): number[] => {
    return numbers.filter((num) => num % 2 !== 0);
  };

  getSum = (numbers: number[]): number => {
    return numbers.reduce((acc, num) => acc + num, 0);
  };

  getAverage = (numbers: number[]): number => {
    const sum = this.getSum(numbers);
    return sum / numbers.length;
  };
}
