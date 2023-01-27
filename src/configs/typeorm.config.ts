import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '13.209.97.209',
  port: 5432,
  username: 'jinytree',
  password: '123123123',
  database: 'servey',

  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // synchronize: true,
};
