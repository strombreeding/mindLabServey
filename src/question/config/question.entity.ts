import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/answer/config/answer.entity';
import { Servey } from 'src/servey/config/servey.entity';
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';

@ObjectType()
@Entity()
export class Question {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({})
  text: string;

  @Field()
  @Column()
  isObjective: boolean;

  @Column({ nullable: false })
  serveyId: number;

  @ManyToOne(() => Servey, (servey) => servey.hasQuestions)
  fromServey: Servey;

  @Field(() => [Answer], { nullable: true })
  @OneToMany(() => Answer, (answer) => answer.fromQuestion)
  hasAnswers: Answer[];

  //
}
