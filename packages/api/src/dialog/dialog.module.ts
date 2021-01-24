import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DialogResolver } from './dialog.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DIALOGS_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL || `redis://localhost:6379`,
        },
      },
    ]),
  ],
  providers: [DialogResolver],
})
export class DialogModule {}
