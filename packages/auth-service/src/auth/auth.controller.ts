import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, RpcException } from '@nestjs/microservices';

import { User } from 'shared/models';
import { SignInInput, SignUpInput } from 'shared/graphql';

import { CREATE_USER_TYPE, FIND_USER_TYPE, VERIFY_USER_TYPE } from 'shared/types/user';
import { REFRESH_SESSION_TYPE, SIGN_IN_TYPE, SIGN_UP_TYPE, VALIDATE_TOKEN } from 'shared/types/auth';

import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @MessagePattern(SIGN_UP_TYPE)
  public async signUp(input: SignUpInput) {
    try {
      const createdUser = await this.userService.send<User>(CREATE_USER_TYPE, input).toPromise();
      const accessToken = await this.authService.createAccessToken(createdUser.id, createdUser.email);
      const { id: sessionId, token } = await this.authService.createRefreshToken(createdUser);

      return {
        user: createdUser,
        session: {
          id: sessionId,
          accessToken,
          refreshToken: token,
        },
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern(SIGN_IN_TYPE)
  public async signIn(input: SignInInput) {
    try {
      const { email, password, rememberUser } = input;
      const verifyPayload = { email, password };
      const user = await this.userService
        .send<User>(FIND_USER_TYPE, { email })
        .toPromise();
      if (user) {
        const verifyPassword = await this.userService.send<boolean>(VERIFY_USER_TYPE, verifyPayload).toPromise();
        if (verifyPassword) {
          if (rememberUser) {
            const accessToken = await this.authService.createAccessToken(user.id, user.email);
            const { id: sessionId, token } = await this.authService.createRefreshToken(user);

            return {
              user,
              session: {
                id: sessionId,
                accessToken,
                refreshToken: token,
              },
            };
          } else {
            return { user };
          }
        } else {
          throw new RpcException('Password is not valid.');
        }
      } else {
        throw new RpcException('Email is not valid.');
      }
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern(VALIDATE_TOKEN)
  async validateToken(payload: string) {
    try {
      return this.authService.validateToken(payload);
    } catch (error) {
      return new RpcException(error.message);
    }
  }

  @MessagePattern(REFRESH_SESSION_TYPE)
  async refreshTokens(payload: { refreshToken: string }) {
    try {
      const { refreshToken } = payload;
      const oldRefreshToken = await this.authService.find(refreshToken);

      if (oldRefreshToken) {
        if (oldRefreshToken.expiresIn > Number(Date.now() / 1000)) {
          const userPayload = { id: oldRefreshToken.user.id };

          const user = await this.userService.send<User>(FIND_USER_TYPE, userPayload).toPromise();
          const { id, token: newRefreshToken, createdAt, updatedAt } = await this.authService.createRefreshToken(user);

          const newAccessToken = this.authService.createAccessToken(user.id, user.email);

          await this.authService.deleteRefreshToken(refreshToken);
          return {
            id: id,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            createdAt,
            updatedAt,
          };
        }

        throw new RpcException('Refresh token is not valid.');
      } else {
        throw new RpcException('Refresh token was not found.');
      }
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
