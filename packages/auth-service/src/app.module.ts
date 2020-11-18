import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as DbProvider from 'shared/ormconfig';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(DbProvider)],
  controllers: [],
  providers: [],
})
export class AppModule {}
