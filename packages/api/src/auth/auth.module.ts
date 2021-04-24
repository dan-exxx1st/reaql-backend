import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthResolver } from './auth.resolver';
import { AuthMicroservice } from 'shared/microservices';

@Module({
  imports: [ClientsModule.register([AuthMicroservice])],
  providers: [AuthResolver],
})
export class AuthModule {}
