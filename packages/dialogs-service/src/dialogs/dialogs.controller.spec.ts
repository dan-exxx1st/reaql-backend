import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Dialog, DialogProps } from 'shared/models';
import { DialogMockFactory, DialogPropsMockFactory, DialogUserServiceMock } from 'shared/test/helpers/Dialog';

import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';

describe('DialogsController', () => {
  let dialogsController: DialogsController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DialogsService,
        {
          provide: getRepositoryToken(Dialog),
          useFactory: DialogMockFactory,
        },
        {
          provide: getRepositoryToken(DialogProps),
          useFactory: DialogPropsMockFactory,
        },
        {
          provide: 'USER_SERVICE',
          useFactory: DialogUserServiceMock,
        },
      ],
      controllers: [DialogsController],
    }).compile();
    dialogsController = await module.get(DialogsController);
  });

  afterAll(() => {
    dialogsController = null;
  });

  describe('findDialogs', () => {
    it('should return a dialog array', async () => {
      const userId = '2';
      const dialogs = await dialogsController.findDialogs({ userId });

      expect(dialogs.length).toEqual(1);
    });

    it('should return the error if user id is too short or undefined', async () => {
      const userId = undefined;

      try {
        const dialogs = await dialogsController.findDialogs({ userId });
        expect(dialogs).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('User id is too short.');
      }
    });

    it('should return the error if user was not found', async () => {
      const userId = 'INVALID_USER_ID';

      try {
        const dialogs = await dialogsController.findDialogs({ userId });
        expect(dialogs).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('User was not found.');
      }
    });

    it('should return the error if dialogs was not found', async () => {
      const userId = '1';

      try {
        const dialogs = await dialogsController.findDialogs({ userId });
        expect(dialogs).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('Dialogs was not found.');
      }
    });
  });

  describe('findDialog', () => {
    it('should return the dialog', async () => {
      const dialogId = '1';
      const dialog = await dialogsController.findDialog({ dialogId });

      expect(dialog.id).toEqual(dialogId);
      expect(dialog.users).toHaveLength(2);
      expect(dialog.dialogProps).toHaveLength(2);
      expect(dialog.group).toEqual(false);
    });

    it('should return the error if the dialog is not found', async () => {
      const dialogId = 'INVALID_ID';

      try {
        const dialog = await dialogsController.findDialog({ dialogId });
        expect(dialog).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('Dialog was not found.');
      }
    });
  });
});
