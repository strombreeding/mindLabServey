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
    return await this.serveyRepository.find();
  }

  async getOne(id: number): Promise<Servey> {
    const servey = await this.serveyRepository.findOne({
      where: { id },
      // relations: ['success', 'hasQuestions'],
    });
    return servey;
  }

  async create(): Promise<Servey> {
    const servey = new Servey();
    const length = await this.serveyRepository.find();
    servey.title = `제목 없는 설문지 ${length.length + 1}`;
    servey.description = '설문에 대한 설명을 해주세요.';
    servey.isUsed = false;
    const newServey = await this.serveyRepository.save(servey);
    console.log('서비스로직 끝');
    return newServey;
  }

  async changeTitle(toChange: UpdateServeyDto): Promise<Servey> {
    const servey = await this.serveyRepository.findOne({
      where: { id: toChange.serveyId },
    });
    if (!servey) throw new ApolloError('해당 설문이 존재하지 않습니다.');
    if (servey.isUsed === true)
      throw new ApolloError(
        '한 번 이상 진행된 설문이기 떄문에 변경할 수 없습니다.',
      );
    servey.title = toChange.title;
    servey.description = toChange.description;
    const update = await this.serveyRepository.save(servey);
    return update;
  }
  async delete(id: number): Promise<true> {
    console.log('들어옴 ㅎㅇㅎㅇ');
    const servey = await this.serveyRepository.findOne({ where: { id } });
    if (!servey) throw new ApolloError('존재하지 않는 설문입니다.');
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
      console.log('gd');
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
      console.log(err.message);

      await conn.rollbackTransaction();
      throw new ApolloError(err);
    } finally {
      await conn.release();
    }
  }
}
