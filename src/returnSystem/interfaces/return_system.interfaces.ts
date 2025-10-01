export interface CalculationJobData {
  start: number;
  end: number;
  operation: string;
  jobId: string;
}

export interface CalculationResult {
  jobId: string;
  result: any;
  status: "completed" | "failed";
  processedAt: Date;
  error?: string;
}
