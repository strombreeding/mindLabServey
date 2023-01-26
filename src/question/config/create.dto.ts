import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuestionDto {
  @Field()
  fromServeyId: number;

  @Field()
  isObjective: boolean;
}
//
