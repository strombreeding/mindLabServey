import { Resolver, Args, Mutation, Context } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { CreateAnswerDto } from './config/create.dto';
import * as utilFn from '../utils/usefulFn';
import { AnswerService } from './answer.service';
import { Answer } from './config/answer.entity';
import { UpdateAnswerDto } from './config/update.dto';
import { Request } from 'express';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { errorLog } from 'src/utils/error';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(
    private readonly answerService: AnswerService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {}

  @Mutation(() => Answer)
  async newAnswer(
    @Args('createAnswerInput') createAnswerDto: CreateAnswerDto,
    @Context('req') req: Request,
  ) {
    try {
      const newServey = await this.answerService.create(createAnswerDto);
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
  async deleteAnswer(
    @Args('inputAnswerId') id: number,
    @Context() req: Request,
  ) {
    try {
      console.log(id);
      const newServey = await this.answerService.delete(id);
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
  async updateAnswer(
    @Args('toChange') updateAnswer: UpdateAnswerDto,
    @Context() req: Request,
  ) {
    const { reward, text, questionId, listNumber } = updateAnswer;
    console.log(updateAnswer);
    const toUpdate = {
      ...(reward && { reward }),
      ...(text && { text }),
    }; //
    console.log(toUpdate);
    try {
      const newServey = await this.answerService.update(
        questionId,
        listNumber,
        toUpdate,
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
}
