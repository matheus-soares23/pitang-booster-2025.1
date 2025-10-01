import { returnSystemService } from "./return_system.service";
import { entryPairDto } from "./dto/entrypair.dto";
import { Body, Controller, Post, Get, Param } from "@nestjs/common";

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

  @Get("result/:jobId")
  async getJobResult(@Param("jobId") jobId: string) {
    return this.returnSystemService.getJobResult(jobId);
  }

  @Post("result/basic-entry")
  getResult(@Body() numberInterval: entryPairDto) {
    return this.returnSystemService.getResult(numberInterval);
  }
}
