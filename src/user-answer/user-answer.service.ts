import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAnswer } from './config/user-answer.entity';
import { UserAnswerRepository } from './config/user-answer.repository';

@Injectable()
export class UserAnswerService {
  constructor() {}
}
