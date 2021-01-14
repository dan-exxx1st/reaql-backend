import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { SessionMockFactory, UserServiceMock } from 'shared/test/helpers/Auth';
import { Session } from 'shared/models';
import { UsersMockData } from 'shared/test/data/users';

describe('AuthController', () => {
  let authController: AuthController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'USER_SERVICE',
          useFactory: UserServiceMock,
        },
        {
          provide: getRepositoryToken(Session),
          useFactory: SessionMockFactory,
        },
      ],
      controllers: [AuthController],
    }).compile();
    authController = await module.get(AuthController);
  });

  afterAll(() => {
    authController = null;
  });

  describe('signUp', () => {
    it('should return user with session', async () => {
      const newUser = { email: 'TEST_USER_EMAIL', name: 'TEST_USER', surname: 'TEST_SURNAME', password: 'TEST_PASS' };
      const result = await authController.signUp(newUser);

      expect(result.user.email).toEqual(newUser.email);
      expect(result.session).toBeDefined();
    });

    it('should return error if user already exists', async () => {
      const { email, name, surname } = UsersMockData[1];
      const newUser = { email, name, surname, password: 'testpass' };

      try {
        const result = await authController.signUp(newUser);
        expect(result.user).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('User already exists.');
      }
    });
  });

  describe('signIn', () => {
    it('should return a new user with session if remember user set true', async () => {
      const userForSignIn = {
        email: UsersMockData[1].email,
        name: 'NEW_USER_NAME',
        surname: 'NEW_USER_SURNAME',
        password: 'NEW_USER_PASSWORD',
        rememberUser: true,
      };
      const result = await authController.signIn(userForSignIn);

      expect(result.user.email).toEqual(userForSignIn.email);
      expect(result.session).toBeDefined();
    });

    it('should return a new user without session if remember user set true', async () => {
      const userForSignIn = {
        email: UsersMockData[1].email,
        name: 'NEW_USER_NAME',
        surname: 'NEW_USER_SURNAME',
        password: 'NEW_USER_PASSWORD',
        rememberUser: false,
      };
      const result = await authController.signIn(userForSignIn);

      expect(result.user.email).toEqual(userForSignIn.email);
      expect(result.session).toBeFalsy();
    });

    it('should return an error if user is not exist of email is not valid.', async () => {
      const userForSignIn = {
        email: 'INVALID_EMAIL',
        name: 'NEW_USER_NAME',
        surname: 'NEW_USER_SURNAME',
        password: 'NEW_USER_PASSWORD',
        rememberUser: false,
      };
      try {
        const result = await authController.signIn(userForSignIn);
        expect(result).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('Email is not valid.');
      }
    });

    it('should return an error if password is not valid.', async () => {
      const userForSignIn = {
        email: UsersMockData[1].email,
        name: 'NEW_USER_NAME',
        surname: 'NEW_USER_SURNAME',
        password: 'INVALID_PASSWORD',
        rememberUser: false,
      };
      try {
        const result = await authController.signIn(userForSignIn);
        expect(result).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('Password is not valid.');
      }
    });
  });

  describe('refreshTokens', () => {
    it('should return a new refresh and access token', async () => {
      const payload = 'refreshToken';
      const { id, refreshToken, accessToken } = await authController.refreshTokens({ refreshToken: payload });
      expect(id).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(accessToken).toBeDefined();
    });

    it('should return an error if refresh token was not found', async () => {
      const invalidToken = 'NOT_FOUND_TOKEN';

      try {
        const newToken = await authController.refreshTokens({ refreshToken: invalidToken });
        expect(newToken).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('Refresh token was not found.');
      }
    });
    it('should return an error if refresh token is not valid', async () => {
      const invalidToken = 'INVALID_REFRESH_TOKEN';

      try {
        const newToken = await authController.refreshTokens({ refreshToken: invalidToken });
        expect(newToken).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual('Refresh token is not valid.');
      }
    });
  });
});
