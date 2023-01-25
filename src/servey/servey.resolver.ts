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
@Resolver(() => Servey)
export class ServeysResolver {
  constructor(private readonly serveyService: ServeyService) {}

  @Query(() => [Servey])
  async allServeies() {
    try {
      const servey = await this.serveyService.getAll();
      console.log(servey);
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
      console.log(servey);
      if (servey === null)
        throw new ApolloError('존재하지 않는 설문지', 'NOT_EXIST_USER');
      return servey;
    } catch (err) {
      console.log(err.message);

      throw new ApolloError(err);
    }
  }

  @Mutation(() => Servey)
  async create(@Args('createServeyInput') createServeyDto: CreateServeyDto) {
    try {
      console.log(createServeyDto, '난리졸브');
      const newServey = await this.serveyService.create(createServeyDto);
      return newServey;
    } catch (err) {
      if (err.message.includes('dupli'))
        throw new ApolloError('해당 title로 이미 설문이 존재합니다.');
    }
  }

  //   @Mutation(()=>Servey)
  //   async createServey(@Args()){}
}
