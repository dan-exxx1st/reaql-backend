import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { CreateDialogInput } from 'shared/graphql';

import { Dialog } from 'shared/models';
import { CREATE_DIALOG_TYPE } from 'shared/types/dialog';

@Resolver()
export class DialogResolver {
  constructor(@Inject('DIALOGS_SERVICE') private readonly dialogService: ClientProxy) {}

  @Mutation()
  async createDialog(@Args('input') input: CreateDialogInput[]) {
    try {
      const newDialog = await this.dialogService
        .send<Dialog>(CREATE_DIALOG_TYPE, { userIdsWithRole: input })
        .toPromise();
      return newDialog;
    } catch (error) {
      return new Error(error.message);
    }
  }
}
