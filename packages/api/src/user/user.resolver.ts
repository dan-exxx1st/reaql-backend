import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'shared/graphql';
import { FIND_ALL_USERS_TYPE } from 'shared/services/types/user';

@Resolver()
export class UserResolver {
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientProxy) {}

  @Query()
  async users(): Promise<User[] | Error> {
    try {
      const users = await this.userService.send(FIND_ALL_USERS_TYPE, {}).toPromise();
      return users.toPromise();
    } catch (error) {
      return new Error(error);
    }
  }
}
