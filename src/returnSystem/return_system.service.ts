import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { entryPairDto } from "./dto/entrypair.dto";
import {
  CalculationJobData,
  StreamingResult,
  ChunkResult,
} from "./interfaces/return_system.interfaces";
import { returnSystemProcessor } from "./return_system.processor";
import { ReturnSystemUtils } from "./return_system.utils";

@Injectable()
export class returnSystemService {
  constructor(
    @InjectQueue("return-system-queue") private calculationQueue: Queue,
    private readonly processor: returnSystemProcessor,
    private readonly returnSystemUtils: ReturnSystemUtils
  ) {}

  async submitCalculation(
    numberInterval: entryPairDto
  ): Promise<{ jobId: string; message: string }> {
    const { start, end, operation, chunkSize } = numberInterval;

    this.returnSystemUtils.validateInterval(start, end);

    const intervalSize = end - start + 1;

    // Verificar se há muitos jobs ativos
    await this.checkSystemLoad();

    const jobId = this.returnSystemUtils.generateJobId();

    // Para intervalos pequenos, processar imediatamente
    if (intervalSize <= 1000) {
      const result = this.returnSystemUtils.processOperation(
        start,
        end,
        operation
      );
      return {
        jobId: "immediate",
        message: `Resultado calculado imediatamente: ${JSON.stringify(result)}`,
      };
    }

    const optimizedChunkSize = this.returnSystemUtils.calculateOptimalChunkSize(
      intervalSize,
      chunkSize
    );

    // Para intervalos grandes, adicionar à fila com sistema de chunks
    const jobData: CalculationJobData = {
      start,
      end,
      operation,
      jobId,
      chunkSize: optimizedChunkSize,
    };

    await this.calculationQueue.add("calculate-interval", jobData, {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      delay: 0,
      removeOnComplete: 10,
      removeOnFail: 5,
    });

    return {
      jobId,
      message: `Cálculo adicionado à fila para processamento em ${Math.ceil(
        intervalSize / optimizedChunkSize
      )} chunks de ${optimizedChunkSize} elementos cada. Use o jobId ${jobId} para verificar o status e obter resultados em streaming.`,
    };
  }

  async getJobStatus(jobId: string): Promise<any> {
    if (jobId === "immediate") {
      return {
        status: "completed",
        message: "O Resultado foi processado imediatamente",
      };
    }

    const jobs = await this.calculationQueue.getJobs([
      "active",
      "waiting",
      "completed",
      "failed",
    ]);
    const job = jobs.find((j) => j.data.jobId === jobId);

    if (!job) {
      throw new Error(`Job com ID ${jobId} não encontrado`);
    }

    const state = await job.getState();
    const progress = job.progress();

    const streamingResult = this.processor.getStreamingResult(jobId);

    return {
      jobId,
      status: state,
      progress,
      createdAt: new Date(job.timestamp),
      processedOn: job.processedOn ? new Date(job.processedOn) : null,
      failedReason: job.failedReason,
      streamingInfo: streamingResult
        ? {
            totalChunks: streamingResult.totalChunks,
            completedChunks: streamingResult.completedChunks,
            currentProgress: streamingResult.currentProgress,
            totalElements: streamingResult.totalElements,
          }
        : null,
    };
  }

  async getJobResult(jobId: string): Promise<any> {
    const status = await this.getJobStatus(jobId);

    if (status.status !== "completed") {
      throw new Error(
        `Job ainda não foi completado. Status atual: ${status.status}`
      );
    }

    const jobs = await this.calculationQueue.getJobs(["completed"]);
    const job = jobs.find((j) => j.data.jobId === jobId);

    if (!job) {
      throw new Error(`Resultado do job ${jobId} não encontrado`);
    }

    return job.returnvalue;
  }

  async getStreamingResult(jobId: string): Promise<StreamingResult> {
    const streamingResult = this.processor.getStreamingResult(jobId);

    if (!streamingResult) {
      throw new Error(`Resultado streaming para job ${jobId} não encontrado`);
    }

    return streamingResult;
  }

  async getChunk(jobId: string, chunkIndex: number): Promise<ChunkResult> {
    const chunk = this.processor.getChunk(jobId, chunkIndex);

    if (!chunk) {
      throw new Error(`Chunk ${chunkIndex} para job ${jobId} não encontrado`);
    }

    return chunk;
  }

  async getChunksPaginated(
    jobId: string,
    page: number = 0,
    limit: number = 10
  ): Promise<{
    chunks: ChunkResult[];
    totalChunks: number;
    currentPage: number;
    hasMore: boolean;
  }> {
    const streamingResult = this.processor.getStreamingResult(jobId);

    if (!streamingResult) {
      throw new Error(`Resultado streaming para job ${jobId} não encontrado`);
    }

    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const chunks = streamingResult.chunks.slice(startIndex, endIndex);

    return {
      chunks,
      totalChunks: streamingResult.totalChunks,
      currentPage: page,
      hasMore: endIndex < streamingResult.chunks.length,
    };
  }

  // Apenas para jobs pequenos, obter todos os números de uma vez
  async getAllNumbers(jobId: string): Promise<number[]> {
    const streamingResult = this.processor.getStreamingResult(jobId);

    if (!streamingResult) {
      throw new Error(`Resultado streaming para job ${jobId} não encontrado`);
    }

    if (streamingResult.totalElements > 1000000) {
      throw new Error(
        `Intervalo muito grande (${streamingResult.totalElements} elementos). Use endpoints paginados.`
      );
    }

    const allNumbers: number[] = [];

    for (const chunk of streamingResult.chunks) {
      allNumbers.push(...chunk.data);
    }

    return allNumbers;
  }

  async clearJobResult(jobId: string): Promise<void> {
    this.processor.clearJobResult(jobId);
  }

  private async checkSystemLoad(): Promise<void> {
    const activeJobs = await this.calculationQueue.getJobs([
      "active",
      "waiting",
    ]);
    if (activeJobs.length >= 5) {
      throw new Error(
        "Sistema sobrecarregado. Tente novamente em alguns minutos."
      );
    }
  }

  async getResult(numberInterval: entryPairDto) {
    return this.submitCalculation(numberInterval);
  }
}
