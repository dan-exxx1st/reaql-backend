import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';

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

  async findAllByDialog(dialogId: string) {
    const dialog = await this.dialogService
      .send<Dialog>(FIND_DIALOG_TYPE, { dialogId })
      .toPromise();

    if (!dialog || !dialog.id) {
      throw new Error('Dialog was not found.');
    }
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where({ dialog })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    const messageWithDialog = messages.map((message) => ({ ...message, dialog }));

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
    await this.dialogService
      .send<boolean>(UPDATE_DIALOG_LAST_MESSAGE_TYPE, { message: text, dialogId })
      .toPromise();

    return message;
  }
}
