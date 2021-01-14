import { CreateMockFactory } from '.';
import { refreshTokens } from '../data/auth';
import { UsersMockData } from '../data/users';

const mocks = {
  users: [UsersMockData[1]],
  data: {},
  toPromise: jest.fn(() => new Promise((resolve) => resolve(mocks.data))),
  send: jest.fn((...props) => {
    switch (props[0].type) {
      case 'create-user': {
        const user = props[1];

        if (UsersMockData.find((mock) => mock.email === user.email) !== undefined) {
          throw new Error('User already exists.');
        }

        mocks.users = [...mocks.users, { id: '1', ...user }];
        mocks.data = { id: '1', ...user };
        break;
      }

      case 'find-user': {
        const { id, email } = props[1];
        let user;

        if (id) user = mocks.users.find((user) => user.id === id);
        if (email) user = mocks.users.find((user) => user.email === email);

        if (user) mocks.data = user;
        if (!user) mocks.data = undefined;
        break;
      }

      case 'verify-users': {
        if (props[1].password !== 'INVALID_PASSWORD') {
          mocks.data = true;
        } else {
          mocks.data = false;
        }

        break;
      }

      default: {
        throw new Error('Send method is not valid.');
      }
    }

    return mocks;
  }),
};

export const UserServiceMock = CreateMockFactory(mocks);

export const SessionMockFactory = CreateMockFactory({
  save: jest.fn((entity) => entity),
  findOne: jest.fn((...props) => {
    const { token } = props[0].where;
    const findToken = refreshTokens.find((tokenObj) => tokenObj.token === token);
    return findToken;
  }),
  find: jest.fn(({ token }) => {
    const findToken = refreshTokens.find((tokenObj) => tokenObj.token === token);
    mocks.data = findToken;
  }),
  remove: jest.fn((entity) => entity),
});
