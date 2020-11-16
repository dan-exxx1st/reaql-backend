import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as DbProvider from 'shared/ormconfig';

import { UserModule } from './user/user.module';

@Module({
    imports: [UserModule, TypeOrmModule.forRoot(DbProvider)],
    controllers: [],
    providers: [],
})
export class AppModule {}
