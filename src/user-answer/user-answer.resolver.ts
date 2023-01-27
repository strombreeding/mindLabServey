import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { CreateUserAnswerDto } from './config/create.dto';
import { UserAnswerService } from './user-answer.service';
import { UserAnswer } from './config/user-answer.entity';
import { ServeyService } from 'src/servey/servey.service';

@Resolver(() => UserAnswer)
export class UserAnswerResolver {
  constructor(private readonly userAnswerService: UserAnswerService) {}

  // @Query()
  // async allUserAnswers(@Args('successSerialNumber') successId: number) {
  //   const result = await this.userAnswerService.getOne(successId);
  //   return result;
  // }
}
