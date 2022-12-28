import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UnauthorizedExceptionFilter } from './utils/unauthorized.exception.filter';
import { HttpExceptionFilter } from './utils/http.exception.filter';
import { AllExceptionFilter } from './utils/all.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.SERVER_PORT || 3000;
  app.useGlobalFilters(
    new AllExceptionFilter(),
    new UnauthorizedExceptionFilter(),
    new HttpExceptionFilter(),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CLINET_URL,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Barcodepong API')
    .setDescription('API Documentation for Barcodepong development')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
}
bootstrap();
