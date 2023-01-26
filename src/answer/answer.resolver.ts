import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { CreateAnswerDto } from './config/create.dto';
import * as utilFn from '../utils/usefulFn';
import { AnswerService } from './answer.service';
import { Answer } from './config/answer.entity';
import { UpdateAnswerDto } from './config/update.dto';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Mutation(() => Answer)
  async newAnswer(@Args('createAnswerInput') createAnswerDto: CreateAnswerDto) {
    try {
      const newServey = await this.answerService.create(createAnswerDto);
      return newServey;
    } catch (err) {
      console.log(err.message);
      throw new ApolloError(err.message);
    }
  }

  @Mutation(() => Boolean)
  async deleteAnswer(@Args('inputAnswerId') id: string) {
    try {
      console.log(id);
      const newServey = await this.answerService.delete(id);
      return newServey;
    } catch (err) {
      console.log(err.message);
      throw new ApolloError(err.message);
    }
  }

  @Mutation(() => Answer)
  async updateAnswer(@Args('toChange') updateAnswer: UpdateAnswerDto) {
    const { reward, text, answerId } = updateAnswer;
    console.log(updateAnswer);
    const toUpdate = {
      ...(reward && { reward }),
      ...(text && { text }),
    }; //
    console.log(toUpdate);
    try {
      const newServey = await this.answerService.update(answerId, toUpdate);
      return newServey;
    } catch (err) {
      console.log(err.message);
      throw new ApolloError(err);
    }
  }
}
