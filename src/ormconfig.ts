import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'devuser',
  password: '369136',
  database: 'blog',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // don't use on production
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
};

// Pour les migrations CLI
export default new DataSource(config);
