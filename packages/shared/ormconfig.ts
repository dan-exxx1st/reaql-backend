import { ConnectionOptions } from 'typeorm';
import appConfig from './config';
import { User, Session, Dialog, DialogProps, Message } from './models';

const { POSTGRES_USER, POSTGRES_PASSWORD, DB_HOST, DB_PORT, POSTGRES_DB, IS_SSL } = appConfig;

const connectionUrl = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}`;

const config: ConnectionOptions = {
  type: 'postgres',
  url: process.env.NODE_ENV === 'production' ? connectionUrl : 'postgres://postgres:123@localhost:5432/reaql-dev',
  ssl: IS_SSL && {
    rejectUnauthorized: false,
  },
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
