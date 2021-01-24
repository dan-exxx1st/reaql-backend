import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessageResolver } from './message.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGE_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL || `redis://localhost:6379`,
        },
      },
    ]),
  ],
  providers: [MessageResolver],
})
export class MessageModule {}
