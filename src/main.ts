import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/AnyException.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useStaticAssets(resolve(__dirname, '../src/public'), {
    prefix: '/public',
  });
  await app.listen(3000);
}
bootstrap();
