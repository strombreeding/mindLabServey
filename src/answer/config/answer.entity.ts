import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Question } from 'src/question/config/question.entity';
import { Servey } from 'src/servey/config/servey.entity';
import { UserAnswer } from 'src/user-answer/config/user-answer.entity';
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

@ObjectType()
@Entity()
export class Answer {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id: number; // questionId-inputNumber

  @Field()
  @Column()
  text: string;

  @Field()
  @Column()
  reward: number;

  @Field()
  @Column()
  listNumber: string;

  @Field()
  @Column({ nullable: false })
  questionId: number;

  @ManyToOne(() => Question, (question) => question.hasAnswers)
  fromQuestion: Question;
}
