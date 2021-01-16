import { UsersMockData } from './users';

const createdAt = new Date(),
  updatedAt = new Date();

export const FirstDialogMock = {
  id: '1',
  createdAt,
  updatedAt,
  users: [UsersMockData[1], UsersMockData[2]],
  group: false,
};

export const DialogPropsMock = [
  {
    id: '1',
    createdAt,
    updatedAt,
    user: UsersMockData[1],
    dialog: FirstDialogMock,
    userRole: 'ADMIN',
    messages: [],
  },
  {
    id: '2',
    createdAt,
    updatedAt,
    user: UsersMockData[2],
    dialog: FirstDialogMock,
    userRole: 'USER',
    messages: [],
  },
];

export const DialogsMock = [{ ...FirstDialogMock, dialogProps: [DialogPropsMock[0], DialogPropsMock[1]] }];
