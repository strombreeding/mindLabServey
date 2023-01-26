import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerRepository } from 'src/answer/config/answer.repository';
import { ServeyRepository } from 'src/servey/config/servey.repository';
import { CreateSuccessDto } from './config/create.dto';
import { Success } from './config/success.entity';
import { SuccessRepository } from './config/success.repository';
import * as utilFn from '../utils/usefulFn';
import { ApolloError } from 'apollo-server-express';
import { QuestionRepository } from 'src/question/config/question.repository';
import { Servey } from 'src/servey/config/servey.entity';

@Injectable()
export class SuccessService {
  constructor(
    @InjectRepository(SuccessRepository)
    private successRepository: SuccessRepository,
    @InjectRepository(ServeyRepository)
    private serveyRepository: ServeyRepository,
    @InjectRepository(AnswerRepository)
    private answerRepository: AnswerRepository,
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
  ) {}

  async getOne(id: number): Promise<Success> {
    const success = this.successRepository.findOne({ where: { id } });
    return success;
  }

  async getAll(): Promise<Success[]> {
    const successList = this.successRepository.find();
    return successList;
  }

  // 설문지 완료는 설문지 Id와 문항에 대한 답변들의 Id 를 주면 된다.
  async create(data: CreateSuccessDto): Promise<Success> {
    console.log('시작');
    const { serveyId, answerIdArr } = data;
    const servey = await this.serveyRepository.findOne({
      where: { id: serveyId },
    });
    console.log(servey);
    if (!servey)
      throw new ApolloError('해당 설문은 존재하지 않습니다.', 'BAD_USER_INPUT');

    const questions = await this.questionRepository.find({
      where: { serveyId, isObjective: true },
      order: { id: 'ASC' },
    });
    if (questions.length === 0)
      throw new ApolloError('해당 설문에는 질문이 없어서 채점이 불가능합니다.');

    let questionsLength = 0;
    let needAnswer: number[] = [];
    for (let i = 0; i < questions.length; i++) {
      const answer = await this.answerRepository.find({
        where: { questionId: questions[i].id },
      });
      if (questions[i].isObjective === true && answer.length > 0) {
        ++questionsLength;
        needAnswer.push(questions[i].id);
      }
    }
    if (questionsLength !== answerIdArr.length)
      throw new ApolloError(
        `객관식 질문에 모두 답해주세요. 필요한 응답의 수 는 ${questionsLength}개 입니다`,
      );
    //
    const success = new Success();
    success.id = utilFn.randomNumber();
    success.serveyId = serveyId;
    success.fromServey = servey;
    let score = 0;
    for (let i = 0; i < answerIdArr.length; i++) {
      const answer = await this.answerRepository.findOne({
        where: { id: answerIdArr[i], questionId: questions[i].id },
      });
      if (answer === null)
        throw new ApolloError(
          `응답이 올바르지 않습니다. 응답이 필요한 문항은 ${needAnswer}입니다`,
        );
      console.log(answerIdArr[i]);
      score = score + answer.reward;
      console.log(score);
    }
    success.score = score;

    const newSucces = await this.successRepository.save(success);
    return newSucces;
  }

  async getServey(success: Success): Promise<Servey> {
    const servey = await this.serveyRepository.findOne({
      where: { id: success.serveyId },
    });
    return servey;
  }

  async delete(id: number): Promise<true> {
    const deleteSuccess = await this.successRepository.delete({ id });
    return true;
  }
}
