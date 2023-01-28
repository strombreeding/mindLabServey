import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './configs/typeorm.config';
import { ServeyService } from './servey/servey.service';
import { ServeyModule } from './servey/servey.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SuccessModule } from './success/success.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { QuestionService } from './question/question.service';
import { AnswerService } from './answer/answer.service';
import { UserAnswerModule } from './user-answer/user-answer.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './utils/winston.util';
import { ServeysResolver } from './servey/servey.resolver';
import { LoggerModule } from './logger/logger.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
    }),
    // WinstonModule.forRoot(winstonLogger),
    LoggerModule,
    ServeyModule,
    SuccessModule,
    QuestionModule,
    AnswerModule,
    UserAnswerModule,
  ],
  //
  controllers: [AppController],
  providers: [AppService, ServeyService, QuestionService, AnswerService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes('*');
//   }
// }
