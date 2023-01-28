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
import { CustomError } from 'src/utils/error';

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
    if (!success) throw new CustomError('존재하지 않는 설문 입니다.', 404);
    return success;
  }

  async getAll(): Promise<Success[]> {
    const successList = await this.successRepository.find();
    if (successList.length === 0)
      throw new CustomError('완료된 설문이 없습니다.', 404);
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
    if (!servey) throw new CustomError('존재하지 않는 설문입니다.', 404);

    const questions = await this.questionRepository.find({
      where: { serveyId },
      order: { id: 'ASC' },
    });
    if (questions.length === 0)
      throw new CustomError(
        '해당 설문에 귀속된 질문이 없습니다. 응답이 불가능합니다.',
        404,
      );

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
      throw new CustomError(
        `질문 문항을 전부 채워주세요. 필요한 응답의 수는 ${questionNeedAnswerLength}개 입니다.`,
        400,
      );

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
          throw new CustomError(
            `'${answerArr[i]}'이 올바른 답변인지 확인 해 주세요.`,
            400,
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
      await conn.rollbackTransaction();
      if (!err.extentions) throw new Error(err);
      throw new CustomError(err.message, 500);
    } finally {
      await conn.release();
    }
  }

  async getServey(success: Success): Promise<Servey> {
    const servey = await this.serveyRepository.findOne({
      where: { id: success.serveyId },
    });
    if (!servey) throw new CustomError('존재하지 않는 설문입니다.', 404);
    return servey;
  }

  async delete(id: number): Promise<true> {
    const success = await this.answerRepository.findOne({ where: { id } });
    if (!success) throw new CustomError('존재하지 않는 완료설문 입니다.', 404);
    await this.userAnswerRepository.delete({ successId: id });
    await this.successRepository.delete({ id });
    return true;
  }

  async getUserAnswer(successId: number): Promise<UserAnswer[]> {
    const userAnswers = await this.userAnswerRepository.find({
      where: { successId },
    });

    return userAnswers;
  }
}
