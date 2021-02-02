import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { CreateDialogInput, DIALOG_USER_ROLES } from 'shared/graphql';
import { Dialog, DialogProps, User } from 'shared/models';
import { FIND_ALL_USERS_TYPE, FIND_USER_TYPE } from 'shared/types/user';
import { formatDistance } from 'date-fns';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(Dialog) private dialogRepository: Repository<Dialog>,
    @InjectRepository(DialogProps) private dialogPropsRepository: Repository<DialogProps>,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  async findAll(userId: string) {
    const user = await this.userService.send(FIND_USER_TYPE, { id: userId }).toPromise();
    if (!user) {
      throw new Error('User was not found.');
    }

    const allDialogProps = await this.dialogPropsRepository.find({
      relations: ['dialog'],
      where: {
        user,
      },
    });

    if (!allDialogProps || allDialogProps.length < 1) {
      return [];
    }

    const allDialogIds = allDialogProps.map((dialogProps) => dialogProps.dialog.id);

    const allDialogs: Dialog[] = await this.dialogRepository
      .createQueryBuilder('dialog')
      .where('dialog.id = any ( :ids )', { ids: allDialogIds })
      .leftJoinAndSelect('dialog.users', 'users')
      .leftJoinAndSelect('dialog.dialogProps', 'dialogProps')
      .leftJoinAndSelect('dialogProps.user', 'user')
      .orderBy('dialog.updatedAt', 'DESC')
      .getMany();

    const dialogsWithLastMessageDate = allDialogs.map((dialog) => ({
      ...dialog,
      lastMessageDate: dialog.lastMessageDate
        ? formatDistance(dialog.lastMessageDate, new Date(), {
            addSuffix: true,
          })
        : null,
    }));

    return dialogsWithLastMessageDate;
  }

  async find(dialogId: string): Promise<Dialog> {
    const dialog = await this.dialogRepository
      .createQueryBuilder('dialog')
      .where('dialog.id = :dialogId', { dialogId })
      .leftJoinAndSelect('dialog.users', 'users')
      .leftJoinAndSelect('dialog.dialogProps', 'dialogProps')
      .leftJoinAndSelect('dialogProps.user', 'user')
      .getOne();

    if (!dialog) {
      return undefined;
    }

    const dialogWithOnlineStatus = {
      ...dialog,
      users: [
        ...dialog.users.map((user) => ({
          ...user,
          online:
            user.online && user.online !== 'online'
              ? `Was online: ${formatDistance(new Date(user.online), new Date(), { addSuffix: true })}`
              : user.online,
        })),
      ],
    };

    return dialogWithOnlineStatus;
  }

  async create(userIdsWithRoles: CreateDialogInput[]): Promise<Dialog> {
    const userIds = userIdsWithRoles.map((idWithRole) => idWithRole.userId);
    const dialogId = v4();
    const users = await this.userService
      .send<User[]>(FIND_ALL_USERS_TYPE, { ids: userIds })
      .toPromise();
    if (!users || users.length < userIds.length) {
      throw new Error('Users was not found.');
    }

    const newDialog: Dialog = {
      id: dialogId,
      users,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      group: false, //! CHANGE
    };

    const savedDialog = await this.dialogRepository.save(newDialog);

    const dialogProps = [];
    for (let i = 0; i < users.length; i++) {
      const currentUser = users[i];

      const userWithRole: CreateDialogInput = userIdsWithRoles.find(
        (userIdWithRole) => userIdWithRole.userId === currentUser.id,
      );

      const newDialogProps = await this.createDialogProps({
        user: currentUser,
        dialog: savedDialog,
        userRole: userWithRole.role,
      });
      dialogProps.push(newDialogProps);
    }

    return {
      ...newDialog,
      users,
      dialogProps,
    };
  }

  async createDialogProps(data: { user: User; dialog: Dialog; userRole: DIALOG_USER_ROLES }): Promise<DialogProps> {
    const { user, dialog, userRole } = data;
    const id = v4();
    const newDialogProps: DialogProps = {
      id,
      user,
      dialog,
      userRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      unreadMessages: 0,
    };

    await this.dialogPropsRepository.save(newDialogProps);

    return newDialogProps;
  }

  async updateLastMessage(message: string, dialogId: string): Promise<boolean> {
    const date = new Date();
    const dialog = await this.dialogRepository.update(
      { id: dialogId },
      { lastMessage: message, lastMessageDate: date },
    );

    return dialog ? true : false;
  }
}
