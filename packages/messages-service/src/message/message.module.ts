import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'shared/models';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL || `redis://localhost:6379`,
        },
      },
      {
        name: 'DIALOG_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL || `redis://localhost:6379`,
        },
      },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [TypeOrmModule],
})
export class MessageModule {}
