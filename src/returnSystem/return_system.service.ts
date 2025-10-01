import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { entryPairDto } from "./dto/entrypair.dto";
import { CalculationJobData, CalculationResult } from './interfaces/return_system.interfaces';

@Injectable()
export class returnSystemService {
  private jobResults = new Map<string, CalculationResult>();
  
  constructor(
    @InjectQueue('return-system-queue') private calculationQueue: Queue
  ) {}

  async submitCalculation(numberInterval: entryPairDto): Promise<{ jobId: string, message: string }> {
    const { start, end, operation } = numberInterval;
    
    if (start > end) {
      throw new Error('O valor inicial deve ser menor ou igual ao valor final');
    }
    
    const intervalSize = end - start + 1;
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Para intervalos pequenos, processar imediatamente
    if (intervalSize <= 1000) {
      const result = await this.processSmallInterval(start, end, operation);
      return {
        jobId: 'immediate',
        message: `Resultado calculado imediatamente: ${JSON.stringify(result)}`
      };
    }
    
    // Para intervalos grandes, adicionar à fila
    const jobData: CalculationJobData = {
      start,
      end,
      operation,
      jobId
    };
    
    await this.calculationQueue.add('calculate-interval', jobData, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      delay: 0
    });
    
    return {
      jobId,
      message: `Cálculo adicionado à fila. Use o jobId ${jobId} para verificar o status.`
    };
  }
  
  async getJobStatus(jobId: string): Promise<any> {
    if (jobId === 'immediate') {
      return { status: 'completed', message: 'O Resultado foi processado imediatamente' };
    }
    
    if (this.jobResults.has(jobId)) {
      return this.jobResults.get(jobId);
    }
    
    const jobs = await this.calculationQueue.getJobs(['active', 'waiting', 'completed', 'failed']);
    const job = jobs.find(j => j.data.jobId === jobId);
    
    if (!job) {
      throw new Error(`Job com ID ${jobId} não encontrado`);
    }
    
    const state = await job.getState();
    const progress = job.progress();
    
    return {
      jobId,
      status: state,
      progress,
      createdAt: new Date(job.timestamp),
      processedOn: job.processedOn ? new Date(job.processedOn) : null,
      failedReason: job.failedReason
    };
  }
  
  async getJobResult(jobId: string): Promise<any> {
    const status = await this.getJobStatus(jobId);
    
    if (status.status !== 'completed') {
      throw new Error(`Job ainda não foi completado. Status atual: ${status.status}`);
    }
    
    if (this.jobResults.has(jobId)) {
      return this.jobResults.get(jobId).result;
    }
    
    const jobs = await this.calculationQueue.getJobs(['completed']);
    const job = jobs.find(j => j.data.jobId === jobId);
    
    if (!job) {
      throw new Error(`Resultado do job ${jobId} não encontrado`);
    }
    
    return job.returnvalue;
  }
  
  private async processSmallInterval(start: number, end: number, operation: string): Promise<any> {
    const numbers = this.generateNumbersArray(start, end);
    
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

  async getResult(numberInterval: entryPairDto) {
    return this.submitCalculation(numberInterval);
  }

  // Para intervalos pequenos, metodos originais
  private generateNumbersArray(start: number, end: number): number[] {
    const numbers: number[] = [];
    for (let i = start; i <= end; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  private getPairNumbers(numbers: number[]): number[] {
    return numbers.filter((num) => num % 2 === 0);
  }

  private getOddNumbers(numbers: number[]): number[] {
    return numbers.filter((num) => num % 2 !== 0);
  }

  getSum(numbers: number[]): number {
    return numbers.reduce((acc, num) => acc + num, 0);
  }

  private getAverage(numbers: number[]): number {
    const sum = this.getSum(numbers);
    return sum / numbers.length;
  }
}
