import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Question } from 'src/question/config/question.entity';
import { Success } from 'src/success/success.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@ObjectType()
@Entity()
@Unique(['title'])
export class Servey {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column()
  title: string;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field(() => [Success], { nullable: true })
  @OneToMany(() => Success, (success) => success.servey)
  success: Success[];

  @Field(() => [Question], { nullable: true })
  @OneToMany(() => Question, (question) => question.fromServey)
  hasQuestions: Question[];
}
