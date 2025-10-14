export interface CalculationJobData {
  start: number;
  end: number;
  operation: string;
  jobId: string;
  chunkSize?: number;
}

export interface CalculationResult {
  jobId: string;
  result: any;
  status: "completed" | "failed" | "processing";
  processedAt: Date;
  error?: string;
  totalChunks?: number;
  completedChunks?: number;
  currentChunk?: ChunkResult;
}

export interface ChunkResult {
  chunkIndex: number;
  start: number;
  end: number;
  data: any;
  timestamp: Date;
}

export interface StreamingResult {
  jobId: string;
  totalElements: number;
  totalChunks: number;
  chunkSize: number;
  status: "processing" | "completed" | "failed";
  chunks: ChunkResult[];
  completedChunks: number;
  currentProgress: number;
}
