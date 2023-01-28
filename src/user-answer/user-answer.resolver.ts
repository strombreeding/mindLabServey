import { Resolver } from '@nestjs/graphql';
import { UserAnswer } from './config/user-answer.entity';

@Resolver(() => UserAnswer)
export class UserAnswerResolver {}
