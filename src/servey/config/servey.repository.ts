import { CustomRepository } from 'src/configs/typeorm.decorator';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Servey } from './servey.entity';

@CustomRepository(Servey)
export class ServeyRepository extends Repository<Servey> {}
