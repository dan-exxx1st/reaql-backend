import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DIALOG_USER_ROLES } from 'shared/graphql';
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
      const dialogs = await dialogsController.findDialogs({ userId });
      expect(dialogs).toHaveLength(0);
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
  describe('createDialog', () => {
    it('should return a new dialog after create', async () => {
      const newDialogData = {
        userIdsWithRole: [
          { userId: '1', role: DIALOG_USER_ROLES.ADMIN },
          { userId: '2', role: DIALOG_USER_ROLES.USER },
        ],
      };

      const newDialog = await dialogsController.createDialog(newDialogData);

      expect(newDialog.id).toBeDefined();
      expect(newDialog.users).toHaveLength(2);
    });

    it('should return the error if users are not found', async () => {
      const wrongDialogData = {
        userIdsWithRole: [
          { userId: 'INVALID_ID', role: DIALOG_USER_ROLES.ADMIN },
          { userId: '2', role: DIALOG_USER_ROLES.USER },
        ],
      };

      try {
        const result = await dialogsController.createDialog(wrongDialogData);
        expect(result).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('Users was not found.');
      }
    });

    it('should return the error if array with user ids shorter than 2', async () => {
      const shortData = { userIdsWithRole: [{ userId: '1', role: DIALOG_USER_ROLES.ADMIN }] };
      try {
        const result = await dialogsController.createDialog(shortData);
        expect(result).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('Array with users ids is too short.');
      }
    });
  });
});
