import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Success } from 'src/success/config/success.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class UserAnswer {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  userAnswers: string; // 유저가 응답한 것

  @Field()
  @Column()
  questionText: string;

  @Field()
  @Column()
  answerText: string;

  @Field()
  @Column({ type: 'bigint' })
  successId: number;

  @ManyToOne(() => Success, (success) => success.hasUserAnswers)
  fromSuccessId: Success;
}
