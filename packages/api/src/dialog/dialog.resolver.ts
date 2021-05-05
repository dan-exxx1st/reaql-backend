import { UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { PubSub } from 'graphql-subscriptions';
import { Observable } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

import { CreateDialogInput } from 'shared/graphql';
import { Dialog } from 'shared/models';
import { CREATE_DIALOG_TYPE, FIND_ALL_DIALOGS_TYPE, FIND_DIALOG_TYPE } from 'shared/types/dialog';
import { AuthGuard } from '../auth/auth.guard';
import { handleResolverError } from '../helpers';

@Resolver()
export class DialogResolver {
  pubSub: PubSub;
  constructor(@Inject('DIALOGS_SERVICE') private readonly dialogService: ClientProxy) {
    this.pubSub = new PubSub();
  }

  @Query()
  @UseGuards(AuthGuard)
  dialogs(@Args('userId') userId: string): Observable<Dialog[] | Error> {
    return this.dialogService
      .send<Dialog[]>(FIND_ALL_DIALOGS_TYPE, { userId })
      .pipe(
        timeout(5000),
        catchError((err: Error) => handleResolverError(err)),
      );
  }

  @Query()
  dialog(@Args('dialogId') dialogId: string): Observable<Dialog | Error> {
    return this.dialogService
      .send<Dialog>(FIND_DIALOG_TYPE, { dialogId })
      .pipe(
        timeout(5000),
        catchError((err: Error) => handleResolverError(err)),
      );
  }

  @Mutation()
  createDialog(@Args('input') input: CreateDialogInput[]): Observable<Dialog | Error> {
    return this.dialogService
      .send<Dialog>(CREATE_DIALOG_TYPE, { userIdsWithRole: input })
      .pipe(
        timeout(5000),
        tap((next) => {
          if (typeof next !== 'string') {
            this.pubSub.publish('dialogCreated', { dialogCreated: next });
          }
        }),
        catchError((err: Error) => handleResolverError(err)),
      );
  }

  @Subscription('dialogCreated', {
    filter: (payload: { dialogCreated: Dialog }, variables: { userId: string }) => {
      const { userId } = variables;
      const { dialogCreated } = payload;
      const { users } = dialogCreated;
      let isUser = false;
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
          isUser = true;
        }
      }
      return isUser;
    },
  })
  dialogCreated() {
    return this.pubSub.asyncIterator('dialogCreated');
  }
}
