import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-express';
import { Answer } from 'src/answer/config/answer.entity';
import { AnswerRepository } from 'src/answer/config/answer.repository';
import { Question } from 'src/question/config/question.entity';
import { QuestionRepository } from 'src/question/config/question.repository';
import { Success } from 'src/success/config/success.entity';
import { SuccessRepository } from 'src/success/config/success.repository';
import { UserAnswer } from 'src/user-answer/config/user-answer.entity';
import { CustomError, errorLog } from 'src/utils/error';
import { DataSource } from 'typeorm';
import { Servey } from './config/servey.entity';
import { ServeyRepository } from './config/servey.repository';
import { UpdateServeyDto } from './config/update.dto';
@Injectable()
export class ServeyService {
  constructor(
    @InjectRepository(ServeyRepository)
    private serveyRepository: ServeyRepository,
    private dataSouce: DataSource,
  ) {}
  async getAll(): Promise<Servey[]> {
    const serveies = await this.serveyRepository.find();
    if (serveies.length === 0)
      throw new CustomError('설문이 존재하지 않습니다.', 404);
    return serveies;
  }

  async getOne(id: number): Promise<Servey> {
    const servey = await this.serveyRepository.findOne({
      where: { id },
    });
    if (!servey) throw new CustomError('존재하지 않는 설문입니다.', 404);
    return servey;
  }

  async create(): Promise<Servey> {
    const servey = new Servey();
    const length = await this.serveyRepository.find();
    servey.title = `제목 없는 설문지 ${length.length + 1}`;
    servey.description = '설문에 대한 설명을 해주세요.';
    servey.isUsed = false;
    const newServey = await this.serveyRepository.save(servey);
    return newServey;
  }

  // 겹치는 title 일때 오류처리 해야함. 하지만 에러로그를 확인하기 위해서 남겨둠.
  async changeTitle(toChange: UpdateServeyDto): Promise<Servey> {
    const servey = await this.serveyRepository.findOne({
      where: { id: toChange.serveyId },
    });
    if (!servey) throw new CustomError('존재하지 않는 설문입니다.', 404);
    if (servey.isUsed === true)
      throw new CustomError(
        '이미 한번 이상 응답된 설문지 입니다. 수정할 수 없습니다.',
        400,
      );
    servey.title = toChange.title;
    servey.description = toChange.description;
    const update = await this.serveyRepository.save(servey);
    return update;
  }
  async delete(id: number): Promise<true> {
    const servey = await this.serveyRepository.findOne({ where: { id } });
    if (!servey) throw new CustomError('존재하지 않는 설문입니다.', 404);
    const conn = this.dataSouce.createQueryRunner();
    await conn.connect();
    await conn.startTransaction();

    try {
      const success = await conn.manager.find(Success, {
        where: { serveyId: id },
      });
      // 유저 응답들 삭제
      for (let i = 0; i < success.length; i++) {
        const userAnswer = await conn.manager.delete(UserAnswer, {
          successId: success[i].id,
        });
      }
      // 완료설문 삭제
      const deleteSuccess = await conn.manager.delete(Success, {
        serveyId: id,
      });

      // 설문의 질문들 찾아서 답변삭제 후 질문 삭제
      const hasQuestions = await conn.manager.find(Question, {
        where: { serveyId: id },
      });
      if (hasQuestions.length > 0) {
        for (let i = 0; i < hasQuestions.length; i++) {
          const deleteAnswer = await conn.manager.delete(Answer, {
            questionId: hasQuestions[i].id,
          });
        }
        const deleteQuestion = await conn.manager.delete(Question, {
          serveyId: id,
        });
      }

      // 설문 삭제
      const result = await conn.manager.delete(Servey, { id });

      await conn.commitTransaction();
      return true;
    } catch (err) {
      await conn.rollbackTransaction();
      if (!err.extentions) {
        throw new Error(err);
      }
      throw new CustomError(err.message, 500);
    } finally {
      await conn.release();
    }
  }
}
