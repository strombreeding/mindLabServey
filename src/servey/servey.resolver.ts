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
import { Servey } from './config/servey.entity';
import { ServeyService } from './servey.service';
import * as utilFn from '../utils/usefulFn';
import { QuestionService } from 'src/question/question.service';
import { UpdateServeyDto } from './config/update.dto';

@Resolver(() => Servey)
export class ServeysResolver {
  constructor(
    private readonly serveyService: ServeyService,
    private readonly questionService: QuestionService,
  ) {}

  @Query(() => [Servey])
  async allServey() {
    try {
      const servey = await this.serveyService.getAll();
      console.log(servey);
      console.log(utilFn.randomNumber());
      if (servey.length === 0)
        throw new ApolloError('설문이 존재하지 않습니다.', 'NOT_EXIST_USER');
      return servey;
    } catch (err) {
      console.log(err.message);

      throw new ApolloError(err);
    }
  }

  @Query(() => Servey)
  async servey(@Args('serveyId', { type: () => Int }) id: number) {
    try {
      const servey = await this.serveyService.getOne(id);
      console.log('enter Servey');
      if (servey === null)
        throw new ApolloError('존재하지 않는 설문지', 'NOT_EXIST_USER');
      return servey;
    } catch (err) {
      console.log(err.message);

      throw new ApolloError(err);
    }
  }

  @Mutation(() => Servey)
  async newServey() {
    try {
      const newServey = await this.serveyService.create();
      return newServey;
    } catch (err) {
      console.log(err.message);
      if (err.message.includes('dupli'))
        throw new ApolloError('해당 title로 이미 설문이 존재합니다.');
    }
  }
  @Mutation(() => Servey)
  /**Servey 의 title과 description 을 변경하게 해줍니다. */
  async updateServey(@Args('toChange') updateServeyDto: UpdateServeyDto) {
    try {
      const newServey = await this.serveyService.changeTitle(updateServeyDto);
      return newServey;
    } catch (err) {
      console.log(err.message);
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Boolean)
  async deleteServey(@Args('deleteToServey') serveyId: number) {
    try {
      const remove = await this.serveyService.delete(serveyId);
      return remove;
    } catch (err) {
      console.log(err.message);
      throw new ApolloError(err);
    }
  }

  @ResolveField()
  async hasQuestions(@Parent() servey: Servey) {
    console.log('enter resolveField ', servey.id);
    try {
      const questions = await this.questionService.getAll(servey.id);
      // console.log('🐳', questions);
      return questions;
    } catch (err) {
      console.log(err.message);
    }
  }
}
