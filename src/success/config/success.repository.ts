import { CustomRepository } from 'src/configs/typeorm.decorator';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Success } from './success.entity';

@CustomRepository(Success)
export class SuccessRepository extends Repository<Success> {}
