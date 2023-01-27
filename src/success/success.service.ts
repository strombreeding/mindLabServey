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
import { DataSource } from 'typeorm';
import { Answer } from 'src/answer/config/answer.entity';
import { Question } from 'src/question/config/question.entity';
import { UserAnswer } from 'src/user-answer/config/user-answer.entity';
import { UserAnswerRepository } from 'src/user-answer/config/user-answer.repository';

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
    @InjectRepository(UserAnswerRepository)
    private userAnswerRepository: UserAnswerRepository,
    private dataSource: DataSource,
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
    const { serveyId, answerArr } = data;
    const totalAnswersLength = answerArr.length;

    // 설문 및 문항의 존재여부 조사 후 예외처리
    const servey = await this.serveyRepository.findOne({
      where: { id: serveyId },
    });
    if (!servey)
      throw new ApolloError('해당 설문은 존재하지 않습니다.', 'BAD_USER_INPUT');

    const questions = await this.questionRepository.find({
      where: { serveyId },
      order: { id: 'ASC' },
    });
    if (questions.length === 0)
      throw new ApolloError('해당 설문에는 질문이 없어서 채점이 불가능합니다.');

    // 설문의 문항과 객관식 문항의 개수
    // let objectiveQuestionLength = 0;
    let needAnswer: number[] = [];
    let questionNeedAnswerLength = 0;
    for (let i = 0; i < questions.length; i++) {
      const answer = await this.answerRepository.find({
        where: { questionId: questions[i].id },
      });
      if (questions[i].isObjective === true && answer.length > 0) {
        // ++objectiveQuestionLength;
        needAnswer.push(questions[i].id);
      }
      questionNeedAnswerLength++;
    }

    // 설문의 문항의 개수와 사용자의 응답의 수가 다를때 오류
    if (questionNeedAnswerLength !== totalAnswersLength)
      throw new ApolloError(
        `질문 문항을 전부 채워주세요. 필요한 응답의 수는 ${questionNeedAnswerLength}개 입니다.`,
      );
    // if (objectiveQuestionLength !== objectiveAnswerArr.length)
    //   throw new ApolloError(
    //     `객관식 질문에 모두 답해주세요. 필요한 객관식 응답의 수 는 ${objectiveQuestionLength}개 입니다`,
    //   );

    // 트랜잭션 시작
    const conn = this.dataSource.createQueryRunner();
    await conn.connect();
    await conn.startTransaction();
    try {
      // 설문완료 인스턴스 생성
      const success = new Success();
      success.id = utilFn.randomNumber();
      success.serveyId = serveyId;
      success.fromServey = servey;

      let score = 0;
      // userAnswer데이터 생성 및 객관식 점수 계산
      for (let i = 0; i < answerArr.length; i++) {
        const userAnswer = new UserAnswer();
        userAnswer.answerText = '주관식';
        userAnswer.questionText = questions[i].text;
        userAnswer.userAnswers = answerArr[i];
        userAnswer.successId = success.id;
        // 객관식 점수 계산
        const answer = await conn.manager.findOne(Answer, {
          where: { listNumber: answerArr[i], questionId: questions[i].id },
        });
        if (!answer && questions[i].isObjective === true)
          throw new ApolloError(
            `'${answerArr[i]}'이 올바른 답변인지 확인 해 주세요.`,
          );
        else if (answer && questions[i].isObjective === true) {
          score = score + answer.reward;
          userAnswer.answerText = answer.text;
        }
        await conn.manager.save(UserAnswer, userAnswer);
      }
      // 합산된 점수를 인스턴스에 할당
      success.score = score;

      const newSucces = await conn.manager.save(Success, success);

      // 완료되었으니 설문, 문항, 답변의 isUsed 업데이트 후, 유저답변 데이터 생성
      servey.isUsed = true;
      await conn.manager.save(Servey, servey);

      // 트랜잭션 커밋 후 리턴
      await conn.commitTransaction();
      return newSucces;
    } catch (err) {
      console.error(err.message);
      await conn.rollbackTransaction();
      throw new ApolloError(err);
    } finally {
      await conn.release();
    }
  }

  async getServey(success: Success): Promise<Servey> {
    const servey = await this.serveyRepository.findOne({
      where: { id: success.serveyId },
    });
    return servey;
  }

  async delete(id: number): Promise<true> {
    await this.userAnswerRepository.delete({ successId: id });
    const deleteSuccess = await this.successRepository.delete({ id });
    return true;
  }

  async getUserAnswer(successId: number): Promise<UserAnswer[]> {
    const userAnswers = await this.userAnswerRepository.find({
      where: { successId },
    });

    return userAnswers;
  }
}
