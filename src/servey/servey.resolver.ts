import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { Servey } from './config/servey.entity';
import { ServeyService } from './servey.service';
import { QuestionService } from 'src/question/question.service';
import { UpdateServeyDto } from './config/update.dto';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Request } from 'express';
import { errorLog } from 'src/utils/error';
import { Logger } from 'winston';

@Resolver(() => Servey)
export class ServeysResolver {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private readonly serveyService: ServeyService,
    private readonly questionService: QuestionService,
  ) {}
  @Query(() => [Servey])
  async allServey(@Context() req: Request): Promise<Servey[]> {
    try {
      const servey = await this.serveyService.getAll();
      return servey;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  @Query(() => Servey)
  async servey(
    @Args('serveyId', { type: () => Int }) id: number,
    @Context('req') req: Request,
  ) {
    try {
      const servey = await this.serveyService.getOne(id);
      return servey;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  @Mutation(() => Servey)
  async newServey(@Context() req: Request) {
    try {
      const newServey = await this.serveyService.create();
      return newServey;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }
  @Mutation(() => Servey)
  /**Servey 의 title과 description 을 변경하게 해줍니다. */
  async updateServey(
    @Args('toChange') updateServeyDto: UpdateServeyDto,
    @Context() req: Request,
  ) {
    try {
      const newServey = await this.serveyService.changeTitle(updateServeyDto);
      return newServey;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  @Mutation(() => Boolean)
  async deleteServey(
    @Args('inputServeyId') serveyId: number,
    @Context() req: Request,
  ) {
    try {
      const remove = await this.serveyService.delete(serveyId);
      return remove;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  @ResolveField()
  async hasQuestions(@Parent() servey: Servey, @Context() req: Request) {
    try {
      const questions = await this.questionService.getAll(servey.id);
      // console.log('🐳', questions);
      return questions;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }
}
