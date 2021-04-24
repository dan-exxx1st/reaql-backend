import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthMicroservice, DialogMicroservice } from 'shared/microservices';
import { DialogResolver } from './dialog.resolver';

@Module({
  imports: [ClientsModule.register([AuthMicroservice, DialogMicroservice])],
  providers: [DialogResolver],
})
export class DialogModule {}
