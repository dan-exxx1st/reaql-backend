import { ConnectionOptions } from 'typeorm';
import { User, Session, Dialog, DialogProps, Message } from './models';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: process.env.DB_USER || 'postgres',
  password: '123',
  database: process.env.DB_NAME || 'reaql-dev',
  entities: [User, Session, Dialog, DialogProps, Message],
  synchronize: true,
  migrationsRun: false,
  logging: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: './packages/shared/migrations',
    entitiesDir: './packages/shared/models',
  },
};

export = config;
