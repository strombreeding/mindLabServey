import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-express';
import { QuestionRepository } from 'src/question/config/question.repository';
import { Answer } from './config/answer.entity';
import { AnswerRepository } from './config/answer.repository';
import { CreateAnswerDto } from './config/create.dto';
import { UpdateAnswerDto } from './config/update.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerRepository)
    private answerRepository: AnswerRepository,

    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
  ) {}

  async getAll(questionId: number): Promise<Answer[]> {
    const answers = await this.answerRepository.find({ where: { questionId } });
    return answers;
  }

  async create(data: CreateAnswerDto): Promise<Answer> {
    const { questionId, reward } = data;

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });
    if (question === null) throw new ApolloError('문항이 존재하지 않습니다.');
    if (question.isObjective === false)
      throw new ApolloError('해당 문항은 객관식이 아닙니다.');
    const answers = await this.answerRepository.find({
      where: { questionId },
    });
    if (answers.length === 10)
      throw new ApolloError('한 문항에 답변은 10개 이하로 해야합니다.');

    const listNumber = String(question.id) + '_' + String(answers.length + 1);
    const answer = new Answer();
    answer.questionId = questionId;
    answer.reward = reward;
    answer.fromQuestion = question;
    answer.text = '답변 (수정하기)';
    answer.id = listNumber;

    const newAnswer = await this.answerRepository.save(answer);
    return newAnswer;
  }

  async update(
    id: string,
    toUpdate: { text?: string; reward?: number; isObjective?: boolean },
  ): Promise<Answer> {
    const updateing = await this.answerRepository.update({ id }, toUpdate);
    const answer = await this.answerRepository.findOne({ where: { id } });
    console.log(answer);
    return answer;
  }

  async delete(id: string): Promise<true> {
    await this.answerRepository.delete({ id });
    return true;
  }
}
