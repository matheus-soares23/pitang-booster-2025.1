import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { CalculationJobData, CalculationResult, ChunkResult, StreamingResult } from './interfaces/return_system.interfaces';
import { ReturnSystemUtils } from './return_system.utils';

// comentario para gerar conflito
// comentario para gerar conflito 2
@Processor('return-system-queue')
export class returnSystemProcessor {
  private readonly MAX_MEMORY_SAFE_SIZE = 1000000;
  private jobResults = new Map<string, StreamingResult>();
  
  constructor(private readonly returnSystemUtils: ReturnSystemUtils) {}
  
  @Process('calculate-interval')
  async handleCalculation(job: Job<CalculationJobData>): Promise<CalculationResult> {
    const { start, end, operation, jobId, chunkSize = 100000 } = job.data;
    
    try {
      await job.progress(5);
      
      const intervalSize = end - start + 1;
      const totalChunks = Math.ceil(intervalSize / chunkSize);
      
      console.log(`Processando intervalo de ${intervalSize} números em ${totalChunks} chunks`);
      
      // Inicializar resultado streaming
      const streamingResult: StreamingResult = {
        jobId,
        totalElements: intervalSize,
        totalChunks,
        chunkSize,
        status: 'processing',
        chunks: [],
        completedChunks: 0,
        currentProgress: 0
      };
      
      this.jobResults.set(jobId, streamingResult);
      await job.progress(10);
      
      // Para intervalos pequenos
      if (intervalSize <= this.MAX_MEMORY_SAFE_SIZE) {
        const result = this.returnSystemUtils.processOperation(start, end, operation);
        streamingResult.status = 'completed';
        streamingResult.completedChunks = 1;
        streamingResult.currentProgress = 100;
        
        return {
          jobId,
          result,
          status: 'completed',
          processedAt: new Date(),
          totalChunks: 1,
          completedChunks: 1
        };
      }
      
      await this.processLargeIntervalInChunks(start, end, operation, chunkSize, job, streamingResult);
      
      streamingResult.status = 'completed';
      await job.progress(100);
      
      return {
        jobId,
        result: `Processamento completo em ${totalChunks} chunks`,
        status: 'completed',
        processedAt: new Date(),
        totalChunks,
        completedChunks: totalChunks
      };
      
    } catch (error) {
      this.jobResults.delete(jobId);
      
      return {
        jobId,
        result: null,
        status: 'failed',
        processedAt: new Date(),
        error: error.message
      };
    }
  }
  
  private async processLargeIntervalInChunks(
    start: number, 
    end: number, 
    operation: string, 
    chunkSize: number, 
    job: Job<CalculationJobData>,
    streamingResult: StreamingResult
  ): Promise<void> {
    const totalElements = end - start + 1;
    const totalChunks = Math.ceil(totalElements / chunkSize);
    
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const chunkStart = start + (chunkIndex * chunkSize);
      const chunkEnd = Math.min(chunkStart + chunkSize - 1, end);
      
      const chunkData = this.returnSystemUtils.processChunk(chunkStart, chunkEnd, operation);
      
      const chunkResult: ChunkResult = {
        chunkIndex,
        start: chunkStart,
        end: chunkEnd,
        data: chunkData,
        timestamp: new Date()
      };
      
      streamingResult.chunks.push(chunkResult);
      streamingResult.completedChunks = chunkIndex + 1;
      streamingResult.currentProgress = Math.round((streamingResult.completedChunks / totalChunks) * 100);
      
      const progress = 10 + Math.round((chunkIndex + 1) / totalChunks * 85);
      await job.progress(progress);
      
      console.log(`Chunk ${chunkIndex + 1}/${totalChunks} processado: ${chunkStart} - ${chunkEnd}`);
      
      // Pequena pausa para não sobrecarregar o sistema
      if (chunkIndex % 10 === 0) {
        await this.sleep(10);
      }
    }
  }
  
  getStreamingResult(jobId: string): StreamingResult | null {
    return this.jobResults.get(jobId) || null;
  }

  getChunk(jobId: string, chunkIndex: number): ChunkResult | null {
    const result = this.jobResults.get(jobId);
    if (!result || !result.chunks[chunkIndex]) {
      return null;
    }
    return result.chunks[chunkIndex];
  }
  
  clearJobResult(jobId: string): void {
    this.jobResults.delete(jobId);
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}