import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { Message, CreateMessageInput } from 'shared/graphql';
import { CREATE_MESSAGE_TYPE, FIND_DIALOG_MESSAGES_TYPE } from 'shared/types/message';

@Resolver()
export class MessageResolver {
  constructor(@Inject('MESSAGE_SERVICE') private readonly messageService: ClientProxy) {}

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

      return newMessage;
    } catch (error) {
      return new Error(error.message);
    }
  }
}
