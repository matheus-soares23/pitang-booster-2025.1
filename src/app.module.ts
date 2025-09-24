import { Module } from '@nestjs/common';
import { returnSystemController } from './returnSystem/return_system.controller';
import { returnSystemService } from './returnSystem/return_system.service';
import { calculatorController } from './calculator/calculator.controller';
import { calculatorService } from './calculator/calculator.service';
import { bubbleSortController } from './bubbleSorter/bubbleSort.controller';
import { bubbleSortService } from './bubbleSorter/bubbleSort.service';

@Module({
  imports: [],
  controllers: [returnSystemController, calculatorController, bubbleSortController],
  providers: [returnSystemService, calculatorService, bubbleSortService],
})
export class AppModule {}