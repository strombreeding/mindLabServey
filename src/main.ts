import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger, loggers } from 'winston';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { winstonLogger } from './utils/winston.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // app.useLogger(app.get(WINSTON_MODULE_PROVIDER));
  // app.useLogger(app.get(WINSTON_MODULE_PROVIDER));
  await app.listen(4000);
}
bootstrap();
