import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Question } from 'src/question/config/question.entity';
import { Servey } from 'src/servey/config/servey.entity';
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
  PrimaryColumn,
} from 'typeorm';

@ObjectType()
@Entity()
@Unique(['id'])
export class Answer {
  @Field(() => String)
  @PrimaryColumn()
  id: string; // questionId-inputNumber

  @Field()
  @Column()
  text: string;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field()
  @Column()
  reward: number;

  @Field()
  @Column({ nullable: false })
  questionId: number;

  @ManyToOne(() => Question, (question) => question.hasAnswers)
  fromQuestion: Question;
}
