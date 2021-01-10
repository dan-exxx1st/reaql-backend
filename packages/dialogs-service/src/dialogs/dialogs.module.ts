import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Dialog, DialogProps } from 'shared/models';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dialog, DialogProps]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: `redis://${process.env.REDIS_HOST || 'localhost'}:6379`,
        },
      },
    ]),
  ],
  controllers: [DialogsController],
  providers: [DialogsService],
  exports: [TypeOrmModule],
})
export class DialogsModule {}
