import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServeyRepository } from 'src/servey/config/servey.repository';
import { ServeyService } from 'src/servey/servey.service';
import { CreateQuestionDto } from './config/create.dto';
import { Question } from './config/question.entity';
import { QuestionRepository } from './config/question.repository';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
    @Inject(forwardRef(() => ServeyService))
    private serveyService: ServeyService,
  ) {}

  async getAll(serveyId: number): Promise<Question[]> {
    const servey = await this.serveyService.getOne(serveyId);
    // SELECT * FROM question WHERE fromServey = ? , [serveyId]
    const questions = await this.questionRepository.find({
      where: { serveyId },
    });
    return questions;
    return;
  }

  async create(data: CreateQuestionDto): Promise<Question> {
    const { fromServeyId, isObjective } = data;
    const servey = await this.serveyService.getOne(data.fromServeyId);
    const question = new Question();
    question.fromServey = servey;
    question.serveyId = fromServeyId;
    question.isObjective = isObjective;

    const newQuestion = await this.questionRepository.save(question);
    return newQuestion;
    return;
  }
}
