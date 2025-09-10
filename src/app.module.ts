import { Module } from '@nestjs/common';
import { returnSystemController } from './returnSystem/return_system.controller';
import { returnSystemService } from './returnSystem/return_system.service';

@Module({
  imports: [],
  controllers: [returnSystemController],
  providers: [returnSystemService],
})
export class AppModule {}