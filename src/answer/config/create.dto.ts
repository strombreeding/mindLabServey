import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAnswerDto {
  @Field()
  questionId: number;
}
//
