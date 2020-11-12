import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const port = Number(process.env.APP_PORT) || 8080;

    const app = await NestFactory.create(AppModule);

    await app.listen(port);
    console.log(`App is listening on addres http://localhost:${port}!`);
}
bootstrap();
