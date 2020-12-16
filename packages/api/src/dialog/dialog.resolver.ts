import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { PubSub } from 'graphql-subscriptions';

import { CreateDialogInput } from 'shared/graphql';
import { Dialog } from 'shared/models';
import { CREATE_DIALOG_TYPE, FIND_DIALOGS_TYPE } from 'shared/types/dialog';

@Resolver()
export class DialogResolver {
  pubSub: PubSub;
  constructor(@Inject('DIALOGS_SERVICE') private readonly dialogService: ClientProxy) {
    this.pubSub = new PubSub();
  }

  @Query()
  async dialogs(@Args('userId') userId: string) {
    try {
      const dialogs = await this.dialogService.send(FIND_DIALOGS_TYPE, { userId }).toPromise();
      return dialogs;
    } catch (error) {
      return new Error(error.message);
    }
  }

  @Mutation()
  async createDialog(@Args('input') input: CreateDialogInput[]) {
    try {
      const newDialog = await this.dialogService
        .send<Dialog>(CREATE_DIALOG_TYPE, { userIdsWithRole: input })
        .toPromise();
      await this.pubSub.publish('dialogCreated', { dialogCreated: newDialog });
      return newDialog;
    } catch (error) {
      return new Error(error.message);
    }
  }

  @Subscription('dialogCreated', {
    filter: (payload, variables) => {
      const { userId } = variables;
      const { dialogCreated } = payload;
      const { users } = dialogCreated;
      let isUser = false;
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
          isUser = true;
        }
      }
      return isUser;
    },
  })
  dialogCreated() {
    return this.pubSub.asyncIterator('dialogCreated');
  }
}
