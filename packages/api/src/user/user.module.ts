import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UserResolver } from './user.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL || `redis://localhost:6379`,
        },
      },
    ]),
  ],
  providers: [UserResolver],
})
export class UserModule {}
