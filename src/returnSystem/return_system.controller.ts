import { returnSystemService } from "./return_system.service";
import { entryPairDto } from "./dto/entrypair.dto";
import { Body, Controller, Post } from "@nestjs/common";

@Controller("return-system")
export class returnSystemController {
  constructor(private returnSystemService: returnSystemService) {}

  @Post()
  getResult(@Body() numberInterval: entryPairDto) {
    return this.returnSystemService.result(numberInterval);
  }
}
