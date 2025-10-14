import { Injectable } from '@nestjs/common';

@Injectable()
export class ReturnSystemUtils {
  
  calculateSum(start: number, end: number): number {
    const n = end - start + 1;
    return (n * (start + end)) / 2;
  }
  
  calculateAverage(start: number, end: number): number {
    return (start + end) / 2;
  }
  
  getPairNumbersInRange(start: number, end: number): number[] {
    const pairs: number[] = [];
    const startEven = start % 2 === 0 ? start : start + 1;
    
    if (startEven <= end) {
      for (let i = startEven; i <= end; i += 2) {
        pairs.push(i);
      }
    }
    
    return pairs;
  }
  
  getOddNumbersInRange(start: number, end: number): number[] {
    const odds: number[] = [];
    const startOdd = start % 2 !== 0 ? start : start + 1;
    
    if (startOdd <= end) {
      for (let i = startOdd; i <= end; i += 2) {
        odds.push(i);
      }
    }
    
    return odds;
  }
  
  processOperation(start: number, end: number, operation: string): any {
    switch (operation) {
      case "sum":
        return this.calculateSum(start, end);
      case "average":
        return this.calculateAverage(start, end);
      case "pair-numbers":
        return this.getPairNumbersInRange(start, end);
      case "odd-numbers":
        return this.getOddNumbersInRange(start, end);
      default:
        return {
          sum: this.calculateSum(start, end),
          average: this.calculateAverage(start, end),
          pairNumbers: this.getPairNumbersInRange(start, end),
          oddNumbers: this.getOddNumbersInRange(start, end)
        };
    }
  }
  
  processChunk(start: number, end: number, operation: string): any {
    switch (operation) {
      case "pair-numbers":
        return this.getPairNumbersInRange(start, end);
      case "odd-numbers":
        return this.getOddNumbersInRange(start, end);
      case "sum":
        return this.calculateSum(start, end);
      case "average":
        return this.calculateAverage(start, end);
      default:
        return this.getPairNumbersInRange(start, end);
    }
  }
  
  calculateOptimalChunkSize(intervalSize: number, requestedChunkSize?: number): number {
    const DEFAULT_CHUNK_SIZE = 1000;
    const MIN_CHUNK_SIZE = 1000;
    const MAX_CHUNK_SIZE = 1000;
    
    if (requestedChunkSize) {
      return Math.max(MIN_CHUNK_SIZE, Math.min(requestedChunkSize, MAX_CHUNK_SIZE));
    }
    
    if (intervalSize > 100_000_000) return MAX_CHUNK_SIZE;
    if (intervalSize > 10_000_000) return 1000;
    if (intervalSize > 1_000_000) return 1000;
    return DEFAULT_CHUNK_SIZE;
  }
  
  validateInterval(start: number, end: number): void {
    if (start > end) {
      throw new Error('O valor inicial deve ser menor ou igual ao valor final');
    }
    
    const intervalSize = end - start + 1;
    
    if (intervalSize > Number.MAX_SAFE_INTEGER) {
      throw new Error('Intervalo acima do limite seguro para processamento em JavaScript');
    }
    
    const MAX_PROCESSING_LIMIT = 10_000_000_000_000;
    if (intervalSize > MAX_PROCESSING_LIMIT) {
      throw new Error(`Intervalo muito grande para processamento (${intervalSize} elementos). Limite máximo: ${MAX_PROCESSING_LIMIT}`);
    }
  }
  
  generateJobId(): string {
    return `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}