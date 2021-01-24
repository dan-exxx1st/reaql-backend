import { ConnectionOptions } from 'typeorm';
import { User, Session, Dialog, DialogProps, Message } from './models';

const config: ConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5432/reaql-dev',
  entities: [User, Session, Dialog, DialogProps, Message],
  synchronize: false,
  migrationsRun: false,
  logging: ['query', 'error'],
  logger: 'file',
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: './packages/shared/migrations',
    entitiesDir: './packages/shared/models',
  },
};

export = config;
