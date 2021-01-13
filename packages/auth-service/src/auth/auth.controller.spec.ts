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
});
