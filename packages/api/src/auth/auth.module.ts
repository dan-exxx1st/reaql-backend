import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: `redis://${process.env.REDIS_HOST || 'localhost'}:6379`,
        },
      },
    ]),
  ],
  providers: [AuthResolver],
})
export class AuthModule {}
