import { ConnectionOptions } from 'typeorm';
import { User, Session, Dialog, DialogProps, Message } from './models';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'reaql-dev',
  entities: [User, Session, Dialog, DialogProps, Message],
  synchronize: true,
  migrationsRun: false,
  logging: true,
  logger: 'file',
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: './packages/shared/migrations',
    entitiesDir: './packages/shared/models',
  },
};

export = config;
