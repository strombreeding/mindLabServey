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
import { Answer } from 'src/answer/config/answer.entity';
import { UpdateQuestionDto } from './config/update.dto';

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
      if (err.message.includes('dupli'))
        throw new ApolloError('해당 title로 이미 설문이 존재합니다.');
      throw new ApolloError(err);
    }
  }

  /**question 의 text를 변경합니다 */
  @Mutation(() => Question)
  async updateQuestion(@Args('toChange') UpdateQuestionDto: UpdateQuestionDto) {
    try {
      const newServey = await this.questionService.changeQuestion(
        UpdateQuestionDto,
      );
      return newServey;
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Boolean)
  async deleteQuestion(@Args('inputQuestionId') id: number) {
    try {
      const newServey = await this.questionService.delete(id);
      return newServey;
    } catch (err) {
      throw new ApolloError(err.message);
    }
  }

  @ResolveField(() => [Answer])
  async hasAnswers(@Parent() question: Question) {
    try {
      const questions = await this.questionService.getAnswers(question);
      return questions;
    } catch (err) {}
  }
}
