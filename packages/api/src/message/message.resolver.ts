import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { PubSub } from 'graphql-subscriptions';
import { Observable } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

import { Message, CreateMessageInput } from 'shared/graphql';
import { CREATE_MESSAGE_TYPE, FIND_DIALOG_MESSAGES_TYPE } from 'shared/types/message';
import { handleResolverError } from '../helpers';

@Resolver()
export class MessageResolver {
  pubSub: PubSub;
  constructor(@Inject('MESSAGE_SERVICE') private readonly messageService: ClientProxy) {
    this.pubSub = new PubSub();
  }

  @Query()
  messages(
    @Args('dialogId') dialogId: string,
    @Args('first') first: number,
    @Args('from') from: number,
  ): Observable<Message[] | Error> {
    return this.messageService
      .send<Message[]>(FIND_DIALOG_MESSAGES_TYPE, { dialogId, first, from })
      .pipe(
        timeout(5000),
        catchError((err: Error) => handleResolverError(err)),
      );
  }

  @Mutation()
  createMessage(@Args('input') input: CreateMessageInput): Observable<Message | Error> {
    return this.messageService.send<Message | Error>(CREATE_MESSAGE_TYPE, input).pipe(
      timeout(5000),
      tap((next) => {
        if ('message' in next) {
          return new Error(next.message);
        }

        this.pubSub.publish('messageCreated', { messageCreated: next });
        this.pubSub.publish('dialogUpdated', {
          dialogUpdated: {
            ...next.dialog,
            lastMessage: next.text,
            lastMessageDate: next.messageDate,
            updatedAt: next.updatedAt,
          },
        });
      }),
      catchError((err: Error) => handleResolverError(err)),
    );
  }

  @Subscription('messageCreated', {
    filter: (payload: { messageCreated: Message }, variables: { dialogId: string }) => {
      const { dialogId } = variables;
      const { messageCreated } = payload;

      const isDialog = messageCreated.dialog.id === dialogId;

      return isDialog;
    },
  })
  messageCreated() {
    return this.pubSub.asyncIterator('messageCreated');
  }

  @Subscription('dialogUpdated', {
    filter: (
      payload: { dialogUpdated: { id: string; lastMessage: string; lastMessageDate: string } },
      variables: { dialogId: string },
    ) => {
      const {
        dialogUpdated: { id },
      } = payload;
      const { dialogId } = variables;
      return dialogId === id ? true : false;
    },
  })
  dialogUpdated() {
    return this.pubSub.asyncIterator('dialogUpdated');
  }
}
