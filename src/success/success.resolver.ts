import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { CreateSuccessDto } from './config/create.dto';
import { SuccessService } from './success.service';
import { Success } from './config/success.entity';
import { ServeyService } from 'src/servey/servey.service';

@Resolver(() => Success)
export class SuccessResolver {
  constructor(private readonly successService: SuccessService) {}

  @Mutation(() => Success)
  async serveySeccess(
    @Args('createSuccessDto') createSuccessDto: CreateSuccessDto,
  ) {
    try {
      console.log(createSuccessDto);
      const newSuccess = await this.successService.create(createSuccessDto);
      return newSuccess;
    } catch (err) {
      console.log(err.message);
      if (err.message.includes('dupli'))
        throw new ApolloError('해당 title로 이미 설문이 존재합니다.');
      throw new Error(err);
    }
  }

  @Mutation(() => Boolean)
  async deleteSuccess(@Args('inputSerialNumber') id: number) {
    try {
      const remove = await this.successService.delete(id);
      return remove;
    } catch (err) {
      console.log(err.message);
      throw new ApolloError(err);
    }
  }

  @Query(() => [Success])
  async allSuccess() {
    try {
      const success = await this.successService.getAll();
      console.log(success);
      if (success.length <= 0) throw new ApolloError('설문 결과가 없습니다.');
      return success;
    } catch (err) {
      throw new ApolloError(err.message);
    }
  }

  @Query(() => Success)
  async success(@Args('serialNumber', { type: () => Number }) id: number) {
    try {
      const success = await this.successService.getOne(id);
      if (!success)
        throw new ApolloError(
          '설문결과가 없습니다. 시리얼 넘버를 확인해보세요.',
        );
      return success;
    } catch (err) {
      console.log(err.message);
      throw new ApolloError(err);
    }
  }
  @ResolveField()
  async fromServey(@Parent() success: Success) {
    try {
      const servey = await this.successService.getServey(success);
      // console.log('🐳', servey);
      return servey;
    } catch (err) {
      console.log(err.message);
    }
  }
  @ResolveField()
  async hasUserAnswers(@Parent() success: Success) {
    try {
      const userAnswer = await this.successService.getUserAnswer(success.id);
      // console.log('🐳', servey);
      return userAnswer;
    } catch (err) {
      console.log(err.message);
    }
  }
}
