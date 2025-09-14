import { Module } from '@nestjs/common';
import { returnSystemController } from './returnSystem/return_system.controller';
import { returnSystemService } from './returnSystem/return_system.service';
import { calculatorController } from './calculator/calculator.controller';
import { calculatorService } from './calculator/calculator.service';

@Module({
  imports: [],
  controllers: [returnSystemController, calculatorController],
  providers: [returnSystemService, calculatorService],
})
export class AppModule {}