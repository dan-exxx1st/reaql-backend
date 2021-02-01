import { Dialog } from 'shared/models';
import { CreateMockFactory } from '.';
import { DialogPropsMock, DialogsMock } from '../data/dialogs';
import { UserMicroserviceMockFactory } from './User';

export const DialogMockFactory = CreateMockFactory({
  createQueryBuilder() {
    this.data = DialogsMock;

    this.where = (_, params) => {
      const { dialogId } = params;
      if (dialogId) {
        const foundDialog = DialogsMock.find((dialog) => dialog.id === dialogId);

        this.data = foundDialog;
      } else {
        this.data = DialogsMock;
      }
      return this;
    };

    this.leftJoinAndSelect = () => {
      return this;
    };

    this.getMany = () => {
      return this.data;
    };

    this.getOne = () => {
      return this.data;
    };

    this.orderBy = () => this;

    return this;
  },
  save: jest.fn((entity) => {
    DialogsMock.push(entity);
    return entity;
  }),
});

export const DialogPropsMockFactory = CreateMockFactory({
  find(entity) {
    const userId = entity.where.user.id;
    const dialogProps = DialogPropsMock.filter(
      (props) => props.dialog.users.find((user) => user.id === userId) !== undefined,
    );
    return dialogProps;
  },
  save: jest.fn((entity) => {
    DialogPropsMock.push(entity);

    return entity;
  }),
});

const mocks = {
  dialogs: DialogsMock,
  data: {},
  toPromise: jest.fn(() => new Promise((resolve) => resolve(mocks.data))),
  send: jest.fn((...props) => {
    switch (props[0].type) {
      case 'find-dialog': {
        const dialogId = props[1].dialogId;
        if (!dialogId) throw new Error('dialog id is not provided.');
        const dialog = mocks.dialogs.find((dialog: Dialog) => dialog.id === dialogId);
        mocks.data = dialog;
        break;
      }

      case 'find-all-dialogs': {
        mocks.data = DialogsMock;
        break;
      }

      default: {
        throw new Error('Dialog type not supported.');
      }
    }

    return mocks;
  }),
};

export const DialogServiceMock = CreateMockFactory(mocks);

export const DialogUserServiceMock = UserMicroserviceMockFactory;
