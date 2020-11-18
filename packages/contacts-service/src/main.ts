import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

const logger = new Logger('Main');

const microserviceOptions = {
  name: 'CONTACTS_SERVICES',
  transport: Transport.REDIS,
  options: {
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:6379`,
  },
  port: 8082,
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions,
  );
  app.listen(() => {
    logger.log(
      `Contacts microservice is listening op port ${microserviceOptions.port}!`,
    );
  });
}
bootstrap();
