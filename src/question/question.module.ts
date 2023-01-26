import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerModule } from 'src/answer/answer.module';
import { TypeOrmCustomModule } from 'src/configs/typeorm.customModule';
import { ServeyModule } from 'src/servey/servey.module';
import { ServeyService } from 'src/servey/servey.service';
import { SuccessModule } from 'src/success/success.module';
import { Question } from './config/question.entity';
import { QuestionRepository } from './config/question.repository';
import { QeustionResolver } from './question.resolver';
import { QuestionService } from './question.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    TypeOrmCustomModule.forCustomRepository([QuestionRepository]),
    forwardRef(() => ServeyModule),
    forwardRef(() => AnswerModule),
    forwardRef(() => SuccessModule),
  ],
  providers: [QuestionService, QeustionResolver, ServeyService],
  exports: [
    TypeOrmModule.forFeature([Question]),
    TypeOrmCustomModule.forCustomRepository([QuestionRepository]),
    QuestionService,
  ],
})
export class QuestionModule {}
