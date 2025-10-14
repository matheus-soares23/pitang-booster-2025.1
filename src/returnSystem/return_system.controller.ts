import { returnSystemService } from "./return_system.service";
import { entryPairDto } from "./dto/entrypair.dto";
import { Body, Controller, Post, Get, Param, Query, Delete } from "@nestjs/common";

@Controller("return-system")
export class returnSystemController {
  constructor(private returnSystemService: returnSystemService) {}

  @Post()
  async submitCalculation(@Body() numberInterval: entryPairDto) {
    return this.returnSystemService.submitCalculation(numberInterval);
  }

  @Get("status/:jobId")
  async getJobStatus(@Param("jobId") jobId: string) {
    return this.returnSystemService.getJobStatus(jobId);
  }

  @Get("streaming/:jobId")
  async getStreamingResult(@Param("jobId") jobId: string) {
    return this.returnSystemService.getStreamingResult(jobId);
  }

  @Get("result/:jobId")
  async getJobResult(@Param("jobId") jobId: string) {
    return this.returnSystemService.getJobResult(jobId);
  }

  @Delete("streaming/:jobId")
  async clearJobResult(@Param("jobId") jobId: string) {
    await this.returnSystemService.clearJobResult(jobId);
    return { message: `Resultado do job ${jobId} foi limpo da memória.` };
  }
}
