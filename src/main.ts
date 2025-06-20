import * as dotenv from 'dotenv';
dotenv.config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔐 This line enables validation everywhere
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();
