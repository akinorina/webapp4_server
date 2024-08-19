import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import accessLogger from './log/accessLogger';

async function bootstrap() {
  const options = { cors: configuration().app.cors };
  const app = await NestFactory.create(AppModule, options);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(accessLogger({ level: 'info' }));
  await app.listen(configuration().app.port);
}
bootstrap();
