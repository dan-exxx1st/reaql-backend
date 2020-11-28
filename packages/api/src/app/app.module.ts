import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { DialogModule } from '../dialog/dialog.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      playground: true,
      debug: false,
      installSubscriptionHandlers: true,
    }),
    UserModule,
    AuthModule,
    DialogModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
