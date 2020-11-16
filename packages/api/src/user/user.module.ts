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
					url: `redis://${process.env.REDIS_HOST || 'localhost'}:6379`,
				},
			},
		]),
	],
	providers: [UserResolver],
})
export class UserModule {}
