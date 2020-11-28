import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'shared/graphql';
import { FIND_USER_TYPE } from 'shared/types/user';

@Resolver()
export class UserResolver {
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientProxy) {}

  @Query()
  async user(@Args('email') email: string): Promise<User | Error> {
    try {
      const user = await this.userService.send(FIND_USER_TYPE, { email }).toPromise();
      return user;
    } catch (error) {
      return new Error(error);
    }
  }
}
