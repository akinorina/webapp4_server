import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';

async function bootstrap() {
  const options = { cors: configuration().app.cors };
  const app = await NestFactory.create(AppModule, options);
  app.setGlobalPrefix('/api');
  await app.listen(configuration().app.port);
}
bootstrap();
