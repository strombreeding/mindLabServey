import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Servey } from 'src/servey/config/servey.entity';
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Question {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ default: '질문 (수정하기)' })
  text: string;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field()
  @Column({ nullable: true })
  isObjective: boolean;

  @Field({ nullable: true })
  @Column()
  serveyId: number;

  @ManyToOne(() => Servey, (servey) => servey.hasQuestions)
  fromServey: Servey;
}
