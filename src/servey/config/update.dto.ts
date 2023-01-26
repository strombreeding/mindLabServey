import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateServeyDto {
  @Field()
  serveyId: number;

  @Field()
  title: string;

  @Field()
  description: string;
}
