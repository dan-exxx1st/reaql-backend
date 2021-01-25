import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { DialogModule } from '../dialog/dialog.module';
import { join } from 'path';
import { MessageModule } from '../message/message.module';

const typePathTest = process.env.TEST ? join(__dirname, '../schema.graphql') : './**/*.graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: [typePathTest],
      playground: true,
      debug: true,
      installSubscriptionHandlers: true,
      context: ({ req, res }) => ({ req, res }),
      introspection: true,
    }),
    UserModule,
    AuthModule,
    DialogModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
