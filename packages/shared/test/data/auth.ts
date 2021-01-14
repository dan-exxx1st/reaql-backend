import { UsersMockData } from './users';

export const refreshTokens = [
  {
    id: '1',
    token: 'refreshToken',
    expiresIn: Number(Math.floor(Date.now() / 1000) + 60 * 60 * 48),
    user: UsersMockData[1],
  },
  {
    id: '2',
    token: 'INVALID_REFRESH_TOKEN',
    expiresIn: Number(Math.floor(Date.now() / 1000) - 60 * 60),
    user: UsersMockData[0],
  },
];
