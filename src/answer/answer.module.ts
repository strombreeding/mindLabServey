import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomModule } from 'src/configs/typeorm.customModule';
import { QuestionModule } from 'src/question/question.module';
import { ServeyModule } from 'src/servey/servey.module';
import { SuccessModule } from 'src/success/success.module';
import { AnswerResolver } from './answer.resolver';
import { AnswerService } from './answer.service';
import { Answer } from './config/answer.entity';
import { AnswerRepository } from './config/answer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer]),
    TypeOrmCustomModule.forCustomRepository([AnswerRepository]),
    forwardRef(() => QuestionModule),
    forwardRef(() => SuccessModule),
    forwardRef(() => ServeyModule),
  ],
  providers: [AnswerService, AnswerResolver],
  exports: [
    TypeOrmModule.forFeature([Answer]),
    TypeOrmCustomModule.forCustomRepository([AnswerRepository]),
    AnswerService,
  ],
})
export class AnswerModule {}
