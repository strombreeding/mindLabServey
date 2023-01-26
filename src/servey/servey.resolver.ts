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
import { CreateServeyDto } from './config/create.dto';
import { Servey } from './config/servey.entity';
import { ServeyService } from './servey.service';
import * as utilFn from '../utils/usefulFn';
import { QuestionService } from 'src/question/question.service';

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
  async servey(@Args('id', { type: () => Int }) id: number) {
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
  async newServey(@Args('createServeyInput') createServeyDto: CreateServeyDto) {
    try {
      console.log(createServeyDto, '난리졸브');
      const newServey = await this.serveyService.create(createServeyDto);
      return newServey;
    } catch (err) {
      console.log(err.message);
      if (err.message.includes('dupli'))
        throw new ApolloError('해당 title로 이미 설문이 존재합니다.');
    }
  }

  @ResolveField()
  async hasQuestions(@Parent() servey: Servey) {
    console.log('enter resolveField ', servey.id);
    try {
      const a = await this.questionService.getAll(servey.id);
      console.log('🐳', a);
      return a;
    } catch (err) {
      console.log(err.message);
    }
  }
  //   @Mutation(()=>Servey)
  //   async createServey(@Args()){}
}
