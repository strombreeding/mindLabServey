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
import { CreateQuestionDto } from './config/create.dto';
import * as utilFn from '../utils/usefulFn';
import { QuestionService } from './question.service';
import { Question } from './config/question.entity';
import { Answer } from 'src/answer/config/answer.entity';
import { UpdateQuestionDto } from './config/update.dto';
import { Request } from 'express';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { errorLog } from 'src/utils/error';

@Resolver(() => Question)
export class QeustionResolver {
  constructor(
    private readonly questionService: QuestionService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {}

  @Mutation(() => Question)
  async newQuestion(
    @Args('createQuestuinInput') createQuestionDto: CreateQuestionDto,
    @Context() req: Request,
  ) {
    try {
      const newServey = await this.questionService.create(createQuestionDto);
      this.logger.log(
        `Method:${utilFn.getWorkLog(req)}, From:[IP: ${req.body.ip}, ${
          req.body.os
        }]`,
        'Request',
      );
      return newServey;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  /**question 의 text를 변경합니다 */
  @Mutation(() => Question)
  async updateQuestion(
    @Args('toChange') UpdateQuestionDto: UpdateQuestionDto,
    @Context() req: Request,
  ) {
    try {
      const newServey = await this.questionService.changeQuestion(
        UpdateQuestionDto,
      );
      this.logger.log(
        `Method:${utilFn.getWorkLog(req)}, From:[IP: ${req.body.ip}, ${
          req.body.os
        }]`,
        'Request',
      );
      return newServey;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  @Mutation(() => Boolean)
  async deleteQuestion(
    @Args('inputQuestionId') id: number,
    @Context() req: Request,
  ) {
    try {
      const newServey = await this.questionService.delete(id);
      this.logger.log(
        `Method:${utilFn.getWorkLog(req)}, From:[IP: ${req.body.ip}, ${
          req.body.os
        }]`,
        'Request',
      );
      return newServey;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  @ResolveField(() => [Answer])
  async hasAnswers(@Parent() question: Question, @Context() req: Request) {
    try {
      const questions = await this.questionService.getAnswers(question);
      this.logger.log(
        `Method:${utilFn.getWorkLog(req)}, From:[IP: ${req.body.ip}, ${
          req.body.os
        }]`,
        'Request',
      );
      return questions;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }
}
