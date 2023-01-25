import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'jinytree',
  password: '123123',
  database: 'servey',

  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
