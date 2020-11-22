import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { User } from 'shared/models';
import { SignInInput, SignUpInput } from 'shared/graphql';

import { createUserType, verifyUserType } from 'shared/services/types/user';
import { signInType, signUpType } from 'shared/services/types/auth';

import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @MessagePattern(signUpType)
  public async signUp(input: SignUpInput) {
    try {
      const createdUser = await this.userService
        .send<User>(createUserType, input)
        .toPromise();
      const accessToken = await this.authService.createAccessToken(
        createdUser.id,
        createdUser.email,
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

  @MessagePattern(signInType)
  public async signIn(input: SignInInput) {
    try {
      const verifyPayload = { email: input.email, password: input.password };
      const verifyPassword = this.userService.send<boolean>(
        verifyUserType,
        verifyPayload,
      );
      if (verifyPassword) {
        const user = await this.userService
          .send<User>({ type: 'get-user' }, { email: input.email })
          .toPromise();

        const accessToken = await this.authService.createAccessToken(
          user.id,
          user.email,
        );
        const {
          id: sessionId,
          refreshToken,
        } = await this.authService.createRefreshToken(user.id);

        return {
          user: user,
          session: {
            id: sessionId,
            accessToken,
            refreshToken,
          },
        };
      } else {
        throw new RpcException('Password is not valid');
      }
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
