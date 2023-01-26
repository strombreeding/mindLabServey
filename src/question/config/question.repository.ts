import { CustomRepository } from 'src/configs/typeorm.decorator';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

@CustomRepository(Question)
export class QuestionRepository extends Repository<Question> {}
