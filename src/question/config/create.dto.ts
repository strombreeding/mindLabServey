import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuestionDto {
  // @Field()
  // text: string;

  @Field()
  fromServeyId: number;

  @Field()
  isObjective: boolean;
}
//
