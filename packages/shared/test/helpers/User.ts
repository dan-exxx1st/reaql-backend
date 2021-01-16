import { CreateMockFactory } from '.';
import { UsersMockData } from '../data/users';

export const UserMockFactory = CreateMockFactory({
  find: jest.fn((props) => {
    const ids: string[] = props.id._value;
    const data = UsersMockData.filter((user) => ids.indexOf(user.id) !== -1);
    return data;
  }),
  findOne: jest.fn((props) => {
    const { email, id } = props;

    if (email) return UsersMockData.find((user) => user.email === email);
    if (id) return UsersMockData.find((user) => user.id === id);
  }),
  createQueryBuilder: jest.fn(() => {
    let data = UsersMockData;
    return {
      where(...props) {
        if (props[1].email.indexOf('INVALID_EMAIL') !== -1) {
          data = [];
        }

        return this;
      },
      andWhere() {
        return this;
      },
      getMany() {
        return data;
      },
    };
  }),
  save: jest.fn((props) => {
    UsersMockData.push(props);
    return props;
  }),
});

const mocks = {
  users: UsersMockData,
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

export const UserMicroserviceMock = mocks;
