import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserAnswerDto {
  @Field()
  successId: number;

  @Field()
  userAnswer: string;

  @Field()
  answerId;
}
//
