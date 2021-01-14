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
