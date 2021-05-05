import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';

import { CREATE_MESSAGE_TYPE, FIND_DIALOG_MESSAGES_TYPE } from 'shared/types/message';

import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @MessagePattern(FIND_DIALOG_MESSAGES_TYPE)
  async findDialogMessages(payload: { dialogId: string; first: number; from: number }) {
    try {
      const messages = await this.messageService.findAllByDialog(payload);
      return messages;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern(CREATE_MESSAGE_TYPE)
  async createMessage(payload: { dialogId: string; userId: string; text: string }) {
    try {
      const newMessage = await this.messageService.create(payload);

      return newMessage;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
