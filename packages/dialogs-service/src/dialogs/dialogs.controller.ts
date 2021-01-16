import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';

import { DialogsService } from './dialogs.service';

import { CreateDialogInput } from 'shared/graphql';
import { CREATE_DIALOG_TYPE, FIND_ALL_DIALOGS_TYPE, FIND_DIALOG_TYPE } from 'shared/types/dialog';
import { Dialog } from 'shared/models';

@Controller('dialogs')
export class DialogsController {
  constructor(private readonly dialogService: DialogsService) {}

  @MessagePattern(FIND_ALL_DIALOGS_TYPE)
  async findDialogs(payload: { userId: string }): Promise<Dialog[]> {
    try {
      const { userId } = payload;
      if (!userId || userId.length < 1) {
        throw new RpcException('User id is too short.');
      }
      const dialogs = await this.dialogService.findAll(userId);
      return dialogs;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern(FIND_DIALOG_TYPE)
  async findDialog(payload: { dialogId: string }): Promise<Dialog> {
    try {
      const { dialogId } = payload;
      const dialog = await this.dialogService.find(dialogId);
      if (!dialog) {
        throw new RpcException('Dialog was not found.');
      }

      return dialog;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern(CREATE_DIALOG_TYPE)
  async createDialog(payload: { userIdsWithRole: CreateDialogInput[] }): Promise<Dialog> {
    try {
      const { userIdsWithRole } = payload;
      if (userIdsWithRole.length < 2) {
        throw new RpcException('Short array with user ids');
      }
      const newDialogWithUsersAndProps = await this.dialogService.create(userIdsWithRole);
      return newDialogWithUsersAndProps;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
