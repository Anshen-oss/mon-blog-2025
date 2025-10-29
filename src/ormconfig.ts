import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'devuser',
  password: '369136',
  database: 'blog',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // don't use on production
};

export default config;
