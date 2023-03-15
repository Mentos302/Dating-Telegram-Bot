import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Sentry.init({
    dsn: 'https://643b83cd1d1b4e408cfe935c7037d8bf@o4504844107317248.ingest.sentry.io/4504844135825408',
  });

  await app.listen(3000);
}
bootstrap();
