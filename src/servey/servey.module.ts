import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerModule } from 'src/answer/answer.module';
import { TypeOrmCustomModule } from 'src/configs/typeorm.customModule';
import { QuestionModule } from 'src/question/question.module';
import { SuccessModule } from 'src/success/success.module';
import { UserAnswerModule } from 'src/user-answer/user-answer.module';
import { Servey } from './config/servey.entity';
import { ServeyRepository } from './config/servey.repository';
import { ServeysResolver } from './servey.resolver';
import { ServeyService } from './servey.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Servey]),
    TypeOrmCustomModule.forCustomRepository([ServeyRepository]),
    forwardRef(() => QuestionModule),
    forwardRef(() => AnswerModule),
    forwardRef(() => SuccessModule),
    forwardRef(() => UserAnswerModule),
  ],
  providers: [ServeyService, ServeysResolver],
  exports: [
    ServeyService,
    TypeOrmModule.forFeature([Servey]),
    TypeOrmCustomModule.forCustomRepository([ServeyRepository]),
  ],
})
export class ServeyModule {}
