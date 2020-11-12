import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

const logger = new Logger('Main');

const microserviceOptions = {
    name: 'USER_SERVICES',
    transport: Transport.REDIS,
    options: {
        url: 'redis://redis:6379',
    },
};

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        AppModule,
        microserviceOptions,
    );
    app.listen(() => {
        logger.log('Users microservice is listening!!!');
    });
}
bootstrap();
