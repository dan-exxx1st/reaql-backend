import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import config from './config';

export const AuthMicroservice: ClientProviderOptions = {
  name: 'AUTH_SERVICE',
  transport: Transport.REDIS,
  options: {
    url: config.REDIS_URL,
  },
};

export const DialogMicroservice: ClientProviderOptions = {
  name: 'DIALOGS_SERVICE',
  transport: Transport.REDIS,
  options: {
    url: process.env.REDIS_URL || `redis://localhost:6379`,
  },
};
