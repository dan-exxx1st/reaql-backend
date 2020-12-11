import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';

import { DialogsService } from './dialogs.service';

import { CreateDialogInput } from 'shared/graphql';
import { CREATE_DIALOG_TYPE } from 'shared/types/dialog';

@Controller('dialogs')
export class DialogsController {
  constructor(private readonly dialogService: DialogsService) {}

  @MessagePattern(CREATE_DIALOG_TYPE)
  async createDialog(payload: { userIdsWithRole: CreateDialogInput[] }) {
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
