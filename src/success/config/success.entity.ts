import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Servey } from 'src/servey/config/servey.entity';
import { UserAnswer } from 'src/user-answer/config/user-answer.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Success {
  @Field(() => Number)
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Field(() => Int, { nullable: true })
  @Column()
  score: number;

  @Column({ nullable: false })
  serveyId: number;

  @Field(() => Servey, { nullable: true })
  @ManyToOne(() => Servey, (servey) => servey.success)
  fromServey: Servey;

  @Field(() => [UserAnswer])
  @OneToMany(() => UserAnswer, (answer) => answer.fromSuccessId)
  hasUserAnswers: UserAnswer[];
}
