import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import * as DbProvider from '../ormconfig';
import { TodosModule } from '../todos/todos.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot(DbProvider),
        GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            playground: true,
            debug: false,
            installSubscriptionHandlers: true,
        }),
        TodosModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
