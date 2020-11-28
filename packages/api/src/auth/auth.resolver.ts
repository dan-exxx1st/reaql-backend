import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { UserAndSession, SignInInput, SignUpInput } from 'shared/graphql';
import { SIGN_UP_TYPE, SIGN_IN_TYPE, REFRESH_SESSION_TYPE } from 'shared/types/auth';

@Resolver()
export class AuthResolver {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy) {}

  @Mutation()
  async signUp(@Args('input') SignUpInput: SignUpInput): Promise<UserAndSession | Error> {
    try {
      const createdUser = await this.authService.send<UserAndSession>(SIGN_UP_TYPE, SignUpInput).toPromise();

      return createdUser;
    } catch (error) {
      return new Error(error.message);
    }
  }

  @Mutation()
  async signIn(@Args('input') signInInput: SignInInput) {
    try {
      const signInUser = await this.authService.send<UserAndSession>(SIGN_IN_TYPE, signInInput).toPromise();
      return signInUser;
    } catch (error) {
      return new Error(error.message);
    }
  }

  @Mutation()
  async refreshSession(@Args('refreshToken') refreshToken: string) {
    try {
      const session = await this.authService.send(REFRESH_SESSION_TYPE, { refreshToken }).toPromise();
      return session;
    } catch (error) {
      return new Error(error.message);
    }
  }
}
