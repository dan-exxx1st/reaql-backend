import { CreateMockFactory } from '.';
import { DialogPropsMock, DialogsMock } from '../data/dialogs';
import { UserMicroserviceMock } from './User';

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

    return this;
  },
});

export const DialogPropsMockFactory = CreateMockFactory({
  find(entity) {
    const userId = entity.where.user.id;
    const dialogProps = DialogPropsMock.filter(
      (props) => props.dialog.users.find((user) => user.id === userId) !== undefined,
    );
    return dialogProps;
  },
});

export const DialogUserServiceMock = CreateMockFactory(UserMicroserviceMock);
