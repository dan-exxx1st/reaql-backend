import { Inject } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';

import { GraphQLResolveInfo } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

import { User, UpdateOnlineStatusInput } from 'shared/graphql';
import { FIND_USERS_BY_EMAIL_TYPE, FIND_USER_TYPE, UPDATE_ONLINE_STATUS_TYPE } from 'shared/types/user';

import { getQueryFields } from '../helpers';

@Resolver()
export class UserResolver {
  pubSub: PubSub;
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientProxy) {
    this.pubSub = new PubSub();
  }

  @Query()
  async user(@Args('email') email: string, @Info() info: GraphQLResolveInfo): Promise<User | Error> {
    // const fieldNames = getQueryFields(info);
    // console.log(fieldNames);

    try {
      const user = await this.userService.send(FIND_USER_TYPE, { email }).toPromise();

      return user;
    } catch (error) {
      return new Error(error.message);
    }
  }

  @Query()
  async searchUsers(@Args('email') email: string, @Args('selfEmail') selfEmail: string): Promise<User[] | Error> {
    try {
      if (email.length < 2) return [];
      const users = await this.userService
        .send<User[]>(FIND_USERS_BY_EMAIL_TYPE, { email, selfEmail })
        .toPromise();

      return users;
    } catch (error) {
      return new Error(error.message);
    }
  }

  @Mutation()
  async updateOnlineStatus(@Args('input') input: UpdateOnlineStatusInput) {
    try {
      const updatedUser = await this.userService.send<User>(UPDATE_ONLINE_STATUS_TYPE, input).toPromise();
      await this.pubSub.publish('dialogOnlineUpdated', { dialogOnlineUpdated: updatedUser });

      return updatedUser;
    } catch (error) {
      return new Error(error.message);
    }
  }

  @Subscription('dialogOnlineUpdated', {
    filter: (payload: { dialogOnlineUpdated: User }, variables: { userId: string }) => {
      const { userId } = variables;
      const { dialogOnlineUpdated } = payload;

      return userId === dialogOnlineUpdated.id;
    },
  })
  async dialogOnlineUpdated() {
    return this.pubSub.asyncIterator('dialogOnlineUpdated');
  }
}
