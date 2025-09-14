import { calculatorService } from "./calculator.service";
import { Body, Controller, Post } from "@nestjs/common";
import { calculatorEntryDto } from "./dto/calculatorEnrtyDto";

@Controller("calculator")
export class calculatorController {
  constructor(private calculatorService: calculatorService) {}

  @Post()
  getResult(@Body() calculatorEntry: calculatorEntryDto) {
    return this.calculatorService.getResult(calculatorEntry.expression);
  }
}
