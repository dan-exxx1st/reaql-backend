import { CreateMockFactory } from '.';
import { refreshTokens } from '../data/auth';
import { UserMicroserviceMock, UserMicroserviceMockFactory } from './User';

export const UserServiceMock = UserMicroserviceMockFactory;

export const SessionMockFactory = CreateMockFactory({
  save: jest.fn((entity) => entity),
  findOne: jest.fn((...props) => {
    const { token } = props[0].where;
    const findToken = refreshTokens.find((tokenObj) => tokenObj.token === token);
    return findToken;
  }),
  find: jest.fn(({ token }) => {
    const findToken = refreshTokens.find((tokenObj) => tokenObj.token === token);
    UserMicroserviceMock.data = findToken;
  }),
  remove: jest.fn((entity) => entity),
});
