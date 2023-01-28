import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from 'src/utils/winston.util';
import { LoggerMiddleware } from './logger.middleware';
// import { LoggerService } from './logger.service';

@Module({
  imports: [WinstonModule.forRoot(winstonLogger)],
  providers: [LoggerMiddleware],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
