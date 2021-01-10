import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DialogsModule } from './dialogs/dialogs.module';

import * as DbProvider from 'shared/ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(DbProvider), DialogsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
