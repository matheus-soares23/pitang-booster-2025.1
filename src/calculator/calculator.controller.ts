import { calculatorService } from "./calculator.service";
import { Body, Controller, Post, HttpException, HttpStatus } from "@nestjs/common";
import { calculatorEntryDto } from "./dto/calculatorEnrtyDto";

@Controller("calculator")
export class calculatorController {
  constructor(private calculatorService: calculatorService) {}

  @Post()
  async getResult(@Body() calculatorEntry: calculatorEntryDto) {
    try {
      const result = await this.calculatorService.getResult(calculatorEntry.expression);
      return { result };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Erro ao processar a expressão',
          error: 'Bad Request'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
