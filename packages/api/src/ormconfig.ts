import { ConnectionOptions } from 'typeorm';
import { Todo } from './models/todo.entity';

const config: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123',
    database: 'reaql-dev',
    entities: [Todo],
    synchronize: true,
    migrationsRun: false,
    logging: true,
    logger: 'file',
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations',
        entitiesDir: 'src/models',
    },
};

export = config;
