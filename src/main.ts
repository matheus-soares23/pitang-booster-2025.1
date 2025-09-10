import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const expressApp = express();
  
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp)
  );
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();