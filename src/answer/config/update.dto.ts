import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAnswerDto {
  @Field()
  questionId: number;

  @Field()
  listNumber: string;

  @Field({ nullable: true })
  text: string;

  @Field({ nullable: true })
  reward: number;
}
