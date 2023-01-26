import { CustomRepository } from 'src/configs/typeorm.decorator';
import { Repository } from 'typeorm';
import { Answer } from './answer.entity';

@CustomRepository(Answer)
export class AnswerRepository extends Repository<Answer> {}
