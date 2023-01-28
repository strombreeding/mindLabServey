import { forwardRef, Module } from '@nestjs/common';
import { AnswerModule } from 'src/answer/answer.module';
import { QuestionModule } from 'src/question/question.module';
import { ServeyModule } from 'src/servey/servey.module';
import { SuccessModule } from '../success/success.module';
import { TypeOrmCustomModule } from 'src/configs/typeorm.customModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAnswer } from './config/user-answer.entity';
import { UserAnswerRepository } from './config/user-answer.repository';
import { UserAnswerResolver } from './user-answer.resolver';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserAnswer]),
    TypeOrmCustomModule.forCustomRepository([UserAnswerRepository]),
    forwardRef(() => ServeyModule),
    forwardRef(() => AnswerModule),
    forwardRef(() => QuestionModule),
    forwardRef(() => SuccessModule),
  ],
  providers: [UserAnswerResolver],
  exports: [
    TypeOrmModule.forFeature([UserAnswer]),
    TypeOrmCustomModule.forCustomRepository([UserAnswerRepository]),
  ],
})
export class UserAnswerModule {}
