import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { formatDistance } from 'date-fns';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { Message, Dialog, User } from 'shared/models';
import { FIND_DIALOG_TYPE, UPDATE_DIALOG_LAST_MESSAGE_TYPE } from 'shared/types/dialog';
import { FIND_USER_TYPE } from 'shared/types/user';
import { MESSAGE_STATUSES } from 'shared/graphql';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    @Inject('DIALOG_SERVICE') private readonly dialogService: ClientProxy,
  ) {}

  async findAllByDialog(payload: { dialogId: string; first: number; from: number }) {
    const { dialogId, first, from } = payload;
    const dialog = await this.dialogService
      .send<Dialog>(FIND_DIALOG_TYPE, { dialogId })
      .toPromise();

    if (!dialog || !dialog.id) {
      throw new Error('Dialog was not found.');
    }

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where({ dialog })
      .skip(from)
      .take(first)
      .leftJoinAndSelect('message.user', 'user')
      .getMany();

    const messagesDates = messages.map((message) => {
      return {
        ...message,
        messageDate: message.messageDate ? formatDistance(message.messageDate, new Date(), { addSuffix: true }) : null,
      };
    });

    const messageWithDialog = messagesDates.map((message) => ({ ...message, dialog }));

    return messageWithDialog;
  }

  async create(payload: { dialogId: string; userId: string; text: string }) {
    const { dialogId, userId, text } = payload;

    const dialog = await this.dialogService
      .send<Dialog>(FIND_DIALOG_TYPE, { dialogId })
      .toPromise();
    const user = await this.userService
      .send<User>(FIND_USER_TYPE, { id: userId })
      .toPromise();

    const newMessage: Message = {
      id: v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      dialog,
      user,
      text,
      messageDate: new Date(),
      messageStatus: MESSAGE_STATUSES.SENDED,
    };

    const message = await this.messageRepository.save(newMessage);

    if (message) {
      await this.dialogService
        .send<boolean>(UPDATE_DIALOG_LAST_MESSAGE_TYPE, { message: text, dialogId })
        .toPromise();

      const messageWithMessageDate = {
        ...newMessage,
        messageDate: newMessage.messageDate
          ? formatDistance(newMessage.messageDate, new Date(), {
              addSuffix: true,
            })
          : null,
      };

      return messageWithMessageDate;
    } else {
      throw new Error('Message was not created.');
    }
  }
}
