import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Question } from 'src/question/config/question.entity';
import { Success } from 'src/success/config/success.entity';
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
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  isUsed: boolean;

  @Field()
  @CreateDateColumn()
  created: Date;

  // @Field(() => [Success], { nullable: true })
  @OneToMany(() => Success, (success) => success.fromServey)
  success: Success[];

  @Field(() => [Question], { nullable: true })
  @OneToMany(() => Question, (question) => question.fromServey)
  hasQuestions: Question[];
}
