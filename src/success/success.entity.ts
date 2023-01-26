import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Servey } from 'src/servey/config/servey.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Success {
  @Field(() => Int)
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Field(() => Int, { nullable: true })
  @Column()
  score: number;

  @Field(() => Servey, { nullable: true })
  @ManyToOne(() => Servey, (servey) => servey.success)
  servey: Servey;
}
