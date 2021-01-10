import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';

import * as DbProvider from 'shared/ormconfig';

@Module({
  imports: [MessageModule, TypeOrmModule.forRoot(DbProvider)],
  controllers: [],
  providers: [],
})
export class AppModule {}
