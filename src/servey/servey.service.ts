import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-express';
import { CreateServeyDto } from './config/create.dto';
import { Servey } from './config/servey.entity';
import { ServeyRepository } from './config/servey.repository';

@Injectable()
export class ServeyService {
  constructor(
    @InjectRepository(ServeyRepository)
    private serveyRepository: ServeyRepository,
  ) {}
  async getAll(): Promise<Servey[]> {
    return await this.serveyRepository.find();
  }

  async getOne(id: number): Promise<Servey> {
    const servey = await this.serveyRepository.findOne({
      where: { id },
      relations: ['success', 'hasQuestions'],
    });
    return servey;
  }

  async create(data: CreateServeyDto) {
    console.log(data);
    const newServey = await this.serveyRepository.save(data);
    console.log('서비스로직 끝');
    return newServey;
  }
}
