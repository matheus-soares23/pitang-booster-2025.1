import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { returnSystemController } from './returnSystem/return_system.controller';
import { returnSystemService } from './returnSystem/return_system.service';
import { calculatorController } from './calculator/calculator.controller';
import { calculatorService } from './calculator/calculator.service';
import { bubbleSortController } from './bubbleSorter/bubbleSort.controller';
import { bubbleSortService } from './bubbleSorter/bubbleSort.service';
import { returnSystemProcessor } from './returnSystem/return_system.processor';
import { ReturnSystemUtils } from './returnSystem/return_system.utils';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'return-system-queue',
    }),
  ],
  controllers: [returnSystemController, calculatorController, bubbleSortController],
  providers: [returnSystemService, calculatorService, bubbleSortService, returnSystemProcessor, ReturnSystemUtils],
})
export class AppModule {}