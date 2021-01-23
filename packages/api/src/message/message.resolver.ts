import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { PubSub } from 'graphql-subscriptions';

import { Message, CreateMessageInput } from 'shared/graphql';
import { CREATE_MESSAGE_TYPE, FIND_DIALOG_MESSAGES_TYPE } from 'shared/types/message';

@Resolver()
export class MessageResolver {
  pubSub: PubSub;
  constructor(@Inject('MESSAGE_SERVICE') private readonly messageService: ClientProxy) {
    this.pubSub = new PubSub();
  }

  @Query()
  async messages(@Args('dialogId') dialogId: string): Promise<Message[] | Error> {
    try {
      const messages = await this.messageService
        .send<Message[]>(FIND_DIALOG_MESSAGES_TYPE, { dialogId })
        .toPromise();
      return messages;
    } catch (error) {
      return new Error(error.message);
    }
  }

  @Mutation()
  async createMessage(@Args('input') input: CreateMessageInput): Promise<Message | Error> {
    try {
      const newMessage = await this.messageService.send<Message>(CREATE_MESSAGE_TYPE, input).toPromise();
      await this.pubSub.publish('messageCreated', { messageCreated: newMessage });
      await this.pubSub.publish('dialogUpdated', {
        dialogUpdated: { ...newMessage.dialog, lastMessage: newMessage.text, lastMessageDate: newMessage.messageDate },
      });
      return newMessage;
    } catch (error) {
      return new Error(error.message);
    }
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
