import { Inject } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';

import { GraphQLResolveInfo } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { Observable, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

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
  user(@Args('email') email: string, @Info() info: GraphQLResolveInfo): Observable<User | string> {
    // const fieldNames = getQueryFields(info);
    // console.log(fieldNames);
    return this.userService
      .send<User>(FIND_USER_TYPE, { email })
      .pipe(
        timeout(5000),
        catchError((err: string) => of(err)),
      );
  }

  @Query()
  searchUsers(@Args('email') email: string, @Args('selfEmail') selfEmail: string): Observable<User[] | string> {
    if (email.length < 2) return of([]);

    return this.userService
      .send<User[]>(FIND_USERS_BY_EMAIL_TYPE, { email, selfEmail })
      .pipe(
        timeout(5000),
        catchError((err: string) => of(err)),
      );
  }

  @Mutation()
  updateOnlineStatus(@Args('input') input: UpdateOnlineStatusInput) {
    return this.userService.send<User>(UPDATE_ONLINE_STATUS_TYPE, input).pipe(
      timeout(5000),
      tap((next) => {
        if (next instanceof User) {
          this.pubSub.publish('dialogOnlineUpdated', { dialogOnlineUpdated: next });
        }
      }),
      catchError((err: string) => of(err)),
    );
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
