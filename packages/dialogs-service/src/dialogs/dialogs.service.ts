import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { v4 } from 'uuid';

import { CreateDialogInput, DIALOG_USER_ROLES } from 'shared/graphql';
import { Dialog, DialogProps, User } from 'shared/models';
import { FIND_ALL_USERS_TYPE, FIND_USER_TYPE } from 'shared/types/user';

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
      return new Error('Users was not found');
    }

    const allDialogProps = await this.dialogPropsRepository.find({
      relations: ['dialog'],
      where: {
        user,
      },
    });

    const allDialogIds = allDialogProps.map((dialogProps) => dialogProps.dialog.id);

    const allDialogs = await this.dialogRepository
      .createQueryBuilder('dialog')
      .where('dialog.id = any ( :ids )', { ids: allDialogIds })
      .leftJoinAndSelect('dialog.users', 'users')
      .leftJoinAndSelect('dialog.dialogProps', 'dialogProps')
      .leftJoinAndSelect('dialogProps.user', 'user')
      .getMany();

    return allDialogs;
  }

  async create(userIdsWithRoles: CreateDialogInput[]): Promise<Dialog | Error> {
    const userIds = userIdsWithRoles.map((idWithRole) => idWithRole.userId);
    const dialogId = v4();
    const users = await this.userService
      .send<User[]>(FIND_ALL_USERS_TYPE, { ids: userIds })
      .toPromise();
    if (!users || users.length < userIds.length) {
      return new Error('Users not found');
    }

    const newDialog: Dialog = {
      id: dialogId,
      users,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
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
}