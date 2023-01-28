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
import { getWorkLog } from 'src/utils/usefulFn';

@Resolver(() => Servey)
export class ServeysResolver {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private readonly serveyService: ServeyService,
    private readonly questionService: QuestionService,
  ) {}
  @Query(() => [Servey])
  async allServey(@Context('req') req: Request): Promise<Servey[]> {
    try {
      const servey = await this.serveyService.getAll();
      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      );
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
      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      );
      return servey;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  @Mutation(() => Servey)
  async newServey(@Context('req') req: Request) {
    try {
      const newServey = await this.serveyService.create();
      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      );
      return newServey;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }
  @Mutation(() => Servey)
  async updateServey(
    @Args('toChange') updateServeyDto: UpdateServeyDto,
    @Context('req') req: Request,
  ) {
    try {
      const newServey = await this.serveyService.changeTitle(updateServeyDto);
      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      );
      return newServey;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  @Mutation(() => Boolean)
  async deleteServey(
    @Args('inputServeyId') serveyId: number,
    @Context('req') req: Request,
  ) {
    try {
      const remove = await this.serveyService.delete(serveyId);
      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      );
      return remove;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  @ResolveField()
  async hasQuestions(@Parent() servey: Servey, @Context('req') req: Request) {
    try {
      const questions = await this.questionService.getAll(servey.id);

      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      ); // console.log('🐳', questions);
      return questions;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }
}
