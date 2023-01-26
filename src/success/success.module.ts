import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerModule } from 'src/answer/answer.module';
import { TypeOrmCustomModule } from 'src/configs/typeorm.customModule';
import { QuestionModule } from 'src/question/question.module';
import { ServeyModule } from 'src/servey/servey.module';
import { ServeyService } from 'src/servey/servey.service';
import { Success } from './config/success.entity';
import { SuccessRepository } from './config/success.repository';
import { SuccessResolver } from './success.resolver';
import { SuccessService } from './success.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Success]),
    TypeOrmCustomModule.forCustomRepository([SuccessRepository]),
    forwardRef(() => ServeyModule),
    forwardRef(() => AnswerModule),
    forwardRef(() => QuestionModule),
  ],
  providers: [SuccessService, SuccessResolver],
  exports: [
    SuccessService,
    TypeOrmModule.forFeature([Success]),
    TypeOrmCustomModule.forCustomRepository([SuccessRepository]),
  ],
})
export class SuccessModule {}
