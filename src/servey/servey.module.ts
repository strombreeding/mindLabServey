import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomModule } from 'src/configs/typeorm.customModule';
import { Servey } from './config/servey.entity';
import { ServeyRepository } from './config/servey.repository';
import { ServeysResolver } from './servey.resolver';
import { ServeyService } from './servey.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Servey]),
    TypeOrmCustomModule.forCustomRepository([ServeyRepository]),
  ],
  providers: [ServeyService, ServeysResolver],
  exports: [
    ServeyService,
    TypeOrmModule.forFeature([Servey]),
    TypeOrmCustomModule.forCustomRepository([ServeyRepository]),
  ],
})
export class ServeyModule {}