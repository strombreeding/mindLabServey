import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-express';
import { QuestionRepository } from 'src/question/config/question.repository';
import { ServeyRepository } from 'src/servey/config/servey.repository';
import { CustomError } from 'src/utils/error';
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
    @InjectRepository(ServeyRepository)
    private serveyRepository: ServeyRepository,
  ) {}

  async getAll(questionId: number): Promise<Answer[]> {
    const answers = await this.answerRepository.find({ where: { questionId } });
    return answers;
  }

  async create(data: CreateAnswerDto): Promise<Answer> {
    const { questionId } = data;

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });
    const materServey = await this.serveyRepository.findOne({
      where: { id: question.serveyId },
    });
    if (question === null) throw new ApolloError('존재하지 않는 문항입니다.');
    if (question.isObjective === false)
      throw new CustomError('해당 문항은 객관식이 아닙니다.', 400);
    const answers = await this.answerRepository.find({
      where: { questionId },
    });
    if (answers.length === 10)
      throw new CustomError('한 문항에 답변은 10개 이하로 해야합니다.', 400);
    if (materServey.isUsed === true)
      throw new CustomError(
        '이미 한번 이상 응답된 설문지 입니다. 수정 및 삭제할 수 없습니다.',
        400,
      );

    const listNumber = String(answers.length + 1);
    const answer = new Answer();
    answer.questionId = questionId;
    answer.reward = 0;
    answer.fromQuestion = question;
    answer.text = '답변 (수정하기)';
    answer.listNumber = listNumber;
    const newAnswer = await this.answerRepository.save(answer);
    return newAnswer;
  }

  async update(
    questionId: number,
    listNumber: string,
    toUpdate: Record<string, string | number>,
  ): Promise<true> {
    const answer = await this.answerRepository.findOne({
      where: { questionId, listNumber },
    });
    const momQuestion = await this.questionRepository.findOne({
      where: { id: answer.questionId },
    });
    const materServey = await this.serveyRepository.findOne({
      where: { id: momQuestion.serveyId },
    });
    if (materServey.isUsed === true)
      throw new CustomError(
        '이미 한번 이상 응답된 설문지 입니다. 수정 및 삭제할 수 없습니다.',
        400,
      );
    //
    const updateing = await this.answerRepository.update(answer, toUpdate);
    return true;
  }

  async delete(id: number): Promise<true> {
    const answer = await this.answerRepository.findOne({ where: { id } });
    if (!answer) throw new CustomError('존재하지 않는 답변입니다.', 404);

    const momQuestion = await this.questionRepository.findOne({
      where: { id: answer.questionId },
    });
    const materServey = await this.serveyRepository.findOne({
      where: { id: momQuestion.serveyId },
    });
    if (materServey.isUsed === true)
      throw new CustomError(
        '이미 한번 이상 응답된 설문지 입니다. 수정 및 삭제할 수 없습니다.',
        400,
      );
    await this.answerRepository.delete({ id });
    return true;
  }
}
