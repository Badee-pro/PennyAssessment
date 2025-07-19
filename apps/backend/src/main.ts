import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

// Bootstrap function to initialize the NestJS application
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for the application (Frontend)
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  // Set the global prefix for all routes
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Log the application startup
  Logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
