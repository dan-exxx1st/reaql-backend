import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { MessageController } from './message.controller';
import { MessageService } from './message.service';

import { DialogServiceMock } from 'shared/test/helpers/Dialog';
import { UserMicroserviceMockFactory } from 'shared/test/helpers/User';
import { Message } from 'shared/models';
import { MessageMockFactory } from 'shared/test/helpers/Message';

describe('MessageController', () => {
  let messageController: MessageController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: 'DIALOG_SERVICE',
          useFactory: DialogServiceMock,
        },
        {
          provide: 'USER_SERVICE',
          useFactory: UserMicroserviceMockFactory,
        },
        {
          provide: getRepositoryToken(Message),
          useFactory: MessageMockFactory,
        },
      ],
      controllers: [MessageController],
    }).compile();

    messageController = await module.get(MessageController);
  });

  afterAll(() => {
    messageController = null;
  });

  describe('findDialogMessages', () => {
    it('should return all messages by dialog id', async () => {
      const dialogId = '1';
      const result = await messageController.findDialogMessages({ dialogId });
      expect(result).toHaveLength(1);
    });

    it('should return the error this dialog was not found', async () => {
      const invalidDialogId = 'INVALID_DIALOG_ID';
      try {
        const result = await messageController.findDialogMessages({ dialogId: invalidDialogId });
        expect(result).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('Dialog was not found.');
      }
    });
  });
});
