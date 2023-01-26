import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateSuccessDto {
  @Field()
  serveyId: number;

  @Field(() => [String])
  answerIdArr: string[];
}
//
