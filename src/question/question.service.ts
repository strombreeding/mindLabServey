import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-express';
import { Answer } from 'src/answer/config/answer.entity';
import { AnswerRepository } from 'src/answer/config/answer.repository';
import { ServeyService } from 'src/servey/servey.service';
import { Success } from 'src/success/config/success.entity';
import { SuccessService } from 'src/success/success.service';
import { DataSource, Repository } from 'typeorm';
import { CreateQuestionDto } from './config/create.dto';
import { Question } from './config/question.entity';
import { QuestionRepository } from './config/question.repository';
import { UpdateQuestionDto } from './config/update.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
    @Inject(forwardRef(() => ServeyService))
    private serveyService: ServeyService,
    @Inject(forwardRef(() => SuccessService))
    private successService: SuccessService,
    @InjectRepository(AnswerRepository)
    private answerRepository: AnswerRepository,
    private dataSource: DataSource,
  ) {}

  async getAll(serveyId: number): Promise<Question[]> {
    // SELECT * FROM question WHERE fromServey = ? , [serveyId]
    const questions = await this.questionRepository.find({
      where: { serveyId },
    });
    return questions;
  }

  async create(data: CreateQuestionDto): Promise<Question> {
    const { fromServeyId, isObjective } = data;
    const servey = await this.serveyService.getOne(data.fromServeyId);
    if (!servey) throw new ApolloError('해당 설문이 없습니다.');
    const question = new Question();
    question.fromServey = servey;
    question.serveyId = fromServeyId;
    question.isObjective = isObjective;
    question.text = '새 질문';
    const newQuestion = await this.questionRepository.save(question);
    return newQuestion;
  }

  async getAnswers(question: Question): Promise<Answer[]> {
    const answer = await this.answerRepository.find({
      where: { questionId: question.id },
      order: { created: 'ASC' },
    });
    return answer;
  }

  async changeQuestion(toChange: UpdateQuestionDto): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id: toChange.questionId },
    });
    question.text = toChange.text;
    const update = await this.questionRepository.save(question);
    return update;
  }

  async delete(id: number, serveyId?: number): Promise<true> {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) throw new ApolloError('해당 id의 질문은 없습니다.');
    const conn = this.dataSource.createQueryRunner();
    await conn.connect();
    await conn.startTransaction();
    try {
      await Promise.all([
        conn.manager.delete(Success, { id: 60535410616871 }),
        conn.manager.delete(Answer, { questionId: 123 }),
        conn.manager.delete(Question, { id }),
        conn.commitTransaction(),
      ]);
      return true;
    } catch (err) {
      await conn.rollbackTransaction();
      console.log(err.message);
      throw new ApolloError(err);
    } finally {
      await conn.release();
    }
  }
}
