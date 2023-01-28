import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { CreateSuccessDto } from './config/create.dto';
import { SuccessService } from './success.service';
import { Success } from './config/success.entity';
import { ServeyService } from 'src/servey/servey.service';
import { Request } from 'express';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { errorLog } from 'src/utils/error';
import { getWorkLog } from 'src/utils/usefulFn';

@Resolver(() => Success)
export class SuccessResolver {
  constructor(
    private readonly successService: SuccessService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {}

  @Mutation(() => Success)
  async serveySeccess(
    @Args('inputServeyIdAndListNumberOrUserAnswer')
    createSuccessDto: CreateSuccessDto,
    @Context() req: Request,
  ) {
    try {
      console.log(createSuccessDto);
      const newSuccess = await this.successService.create(createSuccessDto);
      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      );
      return newSuccess;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  @Mutation(() => Boolean)
  async deleteSuccess(
    @Args('inputSerialNumber') id: number,
    @Context() req: Request,
  ) {
    try {
      const remove = await this.successService.delete(id);
      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      );
      return remove;
    } catch (err) {
      console.log(err.message);
      throw errorLog(err, this.logger, req);
    }
  }

  @Query(() => [Success])
  async allSuccess(@Context() req: Request) {
    try {
      const success = await this.successService.getAll();
      console.log(success);
      if (success.length <= 0) throw new ApolloError('설문 결과가 없습니다.');
      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      );
      return success;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }

  @Query(() => Success)
  async success(
    @Args('serialNumber', { type: () => Number }) id: number,
    @Context() req: Request,
  ) {
    try {
      const success = await this.successService.getOne(id);
      if (!success)
        throw new ApolloError(
          '설문결과가 없습니다. 시리얼 넘버를 확인해보세요.',
        );
      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      );
      return success;
    } catch (err) {
      console.log(err.message);
      throw errorLog(err, this.logger, req);
    }
  }
  @ResolveField()
  async fromServey(@Parent() success: Success, @Context() req: Request) {
    try {
      const servey = await this.successService.getServey(success);
      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      );
      return servey;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }
  @ResolveField()
  async hasUserAnswers(@Parent() success: Success, @Context() req: Request) {
    try {
      const userAnswer = await this.successService.getUserAnswer(success.id);
      this.logger.log(
        `Method:${getWorkLog(req)}, From:[IP: ${req.body.ip}, ${req.body.os}]`,
        'Request',
      );
      return userAnswer;
    } catch (err) {
      throw errorLog(err, this.logger, req);
    }
  }
}
