import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { User } from 'shared/models';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @MessagePattern({ type: 'sign-up' })
  public async signUp(user: User) {
    try {
      const createdUser = await this.userService
        .send<User>({ type: 'create-user' }, user)
        .toPromise();
      const accessToken = await this.authService.createAccessToken(
        createdUser.id,
        user.email,
      );
      const {
        id: sessionId,
        refreshToken,
      } = await this.authService.createRefreshToken(createdUser.id);

      return {
        user: createdUser,
        session: {
          id: sessionId,
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
