import { CustomRepository } from 'src/configs/typeorm.decorator';
import { Repository } from 'typeorm';
import { UserAnswer } from './user-answer.entity';

@CustomRepository(UserAnswer)
export class UserAnswerRepository extends Repository<UserAnswer> {}
