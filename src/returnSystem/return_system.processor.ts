import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { CalculationJobData, CalculationResult } from './interfaces/return_system.interfaces';

@Processor('return-system-queue')
export class returnSystemProcessor {
  
  @Process('calculate-interval')
  async handleCalculation(job: Job<CalculationJobData>): Promise<CalculationResult> {
    const { start, end, operation, jobId } = job.data;
    
    try {
      await job.progress(10);
      
      const intervalSize = end - start + 1;
      
      console.log(`Processando intervalo de ${intervalSize} números (${start} a ${end})`);
      
      await job.progress(20);
      
      const numbers = this.generateNumbers(start, end);
      
      await job.progress(50);
      
      let result: any;
      
      switch (operation) {
        case "sum":
          result = this.calculateSum(start, end);
          break;
        case "average":
          result = this.calculateAverage(start, end);
          break;
        case "pair-numbers":
          result = this.getPairNumbers(start, end);
          break;
        case "odd-numbers":
          result = this.getOddNumbers(start, end);
          break;
        default:
          result = {
            sum: this.calculateSum(start, end),
            average: this.calculateAverage(start, end),
            pairNumbers: this.getPairNumbers(start, end),
            oddNumbers: this.getOddNumbers(start, end)
          };
      }
      
      await job.progress(100);
      
      return {
        jobId,
        result,
        status: 'completed',
        processedAt: new Date()
      };
      
    } catch (error) {
      return {
        jobId,
        result: null,
        status: 'failed',
        processedAt: new Date(),
        error: error.message
      };
    }
  }
  
  private calculateSum(start: number, end: number): number {
    const n = end - start + 1;
    return (n * (start + end)) / 2;
  }
  
  private calculateAverage(start: number, end: number): number {
    return (start + end) / 2;
  }
  
  private getPairNumbers(start: number, end: number): number[] | { count: number, first: number, last: number } {
    const intervalSize = end - start + 1;
    
    // Para intervalos muito grandes, retorno resumido
    if (intervalSize > 1000000) {
      const startEven = start % 2 === 0 ? start : start + 1;
      const endEven = end % 2 === 0 ? end : end - 1;
      
      if (startEven > endEven) {
        return { count: 0, first: null, last: null };
      }
      
      const count = Math.floor((endEven - startEven) / 2) + 1;
      return { count, first: startEven, last: endEven };
    }
    
    // Para intervalos menores, retorno completo do array
    const pairs: number[] = [];
    const startEven = start % 2 === 0 ? start : start + 1;
    
    for (let i = startEven; i <= end; i += 2) {
      pairs.push(i);
    }
    return pairs;
  }
  
  private getOddNumbers(start: number, end: number): number[] | { count: number, first: number, last: number } {
    const intervalSize = end - start + 1;
    
    // Para intervalos muito grandes, retorno resumido
    if (intervalSize > 1000000) {
      const startOdd = start % 2 !== 0 ? start : start + 1;
      const endOdd = end % 2 !== 0 ? end : end - 1;
      
      if (startOdd > endOdd) {
        return { count: 0, first: null, last: null };
      }
      
      const count = Math.floor((endOdd - startOdd) / 2) + 1;
      return { count, first: startOdd, last: endOdd };
    }
    
    // Para intervalos menores, retorno completo do array
    const odds: number[] = [];
    const startOdd = start % 2 !== 0 ? start : start + 1;
    
    for (let i = startOdd; i <= end; i += 2) {
      odds.push(i);
    }
    return odds;
  }
  
  private generateNumbers(start: number, end: number): number[] {
    const intervalSize = end - start + 1;
    if (intervalSize <= 1000) {
      const numbers: number[] = [];
      for (let i = start; i <= end; i++) {
        numbers.push(i);
      }
      return numbers;
    }
    
    return [];
  }
}