import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateQuestionDto {
  @Field()
  questionId: number;

  @Field()
  text: string;
}
