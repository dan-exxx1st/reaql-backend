import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { UserAndSession, SignUpInput, SignInInput } from 'shared/graphql';
import { signInType } from 'shared/services/types/auth';

@Resolver()
export class UserResolver {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Query()
  async users() {
    const users = await this.userService.send({ type: 'get-users' }, {});
    return users.toPromise();
  }

  @Mutation()
  async signUp(@Args('input') SignUpInput: SignUpInput) {
    try {
      const pattern = { type: 'sign-up' };

      const createdUser = await this.authService
        .send<UserAndSession>(pattern, SignUpInput)
        .toPromise();

      return createdUser;
    } catch (error) {
      return new Error(error.message);
    }
  }

  @Mutation()
  async signIn(@Args('input') signInInput: SignInInput) {
    try {
      const signInUser = await this.authService
        .send<UserAndSession>(signInType, signInInput)
        .toPromise();
      return signInUser;
    } catch (error) {
      return new Error(error.message);
    }
  }
}
