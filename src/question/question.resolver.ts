import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { CreateQuestionDto } from './config/create.dto';
import * as utilFn from '../utils/usefulFn';
import { QuestionService } from './question.service';
import { Question } from './config/question.entity';

@Resolver(() => Question)
export class QeustionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Mutation(() => Question)
  async newQuestion(
    @Args('createQuestuinInput') createQuestionDto: CreateQuestionDto,
  ) {
    try {
      const newServey = await this.questionService.create(createQuestionDto);
      return newServey;
    } catch (err) {
      console.log(err.message);
      if (err.message.includes('dupli'))
        throw new ApolloError('해당 title로 이미 설문이 존재합니다.');
    }
  }

  //   @Mutation(()=>Servey)
  //   async createServey(@Args()){}
}
