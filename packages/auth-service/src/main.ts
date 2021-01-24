import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

const logger = new Logger('Main');

const microserviceOptions = {
  name: 'AUTH_SERVICE',
  transport: Transport.REDIS,
  options: {
    url: process.env.REDIS_URL || `redis://localhost:6379`,
  },
  port: 8084,
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, microserviceOptions);
  app.listen(() => {
    logger.log(`Auth microservice is listening on port ${microserviceOptions.port}!`);
  });
}
bootstrap();
