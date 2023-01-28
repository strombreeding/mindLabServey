import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '13.209.97.209',
  port: 5432,
  username: 'jinytree',
  password: '123123123',
  database: 'servey',

  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // synchronize: true, // 자동 테이블 생성임. 엔티티 수정이 끝나면 꺼야함
};
