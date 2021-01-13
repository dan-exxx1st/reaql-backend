import { CreateMockFactory } from '.';
import { UsersMockData } from '../data/users';

const mocks = {
  users: [UsersMockData[1]],
  user: {},
  toPromise: jest.fn(() => new Promise((resolve) => resolve(mocks.user))),
  send: jest.fn((...props) => {
    if (props[0].type === 'create-user') {
      const user = props[1];

      if (UsersMockData.find((mock) => mock.email === user.email) !== undefined) {
        throw new Error('User already exists.');
      }

      mocks.users = [...mocks.users, { id: '1', ...user }];
      mocks.user = { id: '1', ...user };
    }

    return mocks;
  }),
};

export const UserServiceMock = CreateMockFactory(mocks);

export const SessionMockFactory = CreateMockFactory({
  save: jest.fn((entity) => entity),
});
