import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';

@Module({
  providers: [AnswerService]
})
export class AnswerModule {}
