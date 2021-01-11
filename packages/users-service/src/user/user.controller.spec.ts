import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'shared/models';

import { UsersMockData } from 'shared/test/data/users';
import { MockType } from 'shared/types/test';

import { UserController } from './user.controller';
import { UserService } from './user.service';

//@ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
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
}));

describe('UserController', () => {
  let userController: UserController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
      controllers: [UserController],
    }).compile();
    userController = await module.get(UserController);
  });

  afterAll(() => {
    userController = null;
  });

  describe('getUsers', () => {
    it('should return an array of users which have lenght equal 3', async () => {
      const ids = ['1', '2', '3'];
      const getUsersByIds = await userController.getUsers({ ids });
      expect(getUsersByIds).toHaveLength(3);
    });

    it('should return the error if users was not found', async () => {
      const ids = ['999', '9999'];
      try {
        const result = await userController.getUsers({ ids });
        if (result.length > 0) throw new Error('Result is not empty.');
      } catch (error) {
        expect(error.message).toEqual('Users was not found.');
      }
    });
  });

  describe('getUser', () => {
    it('should return the user by email', async () => {
      const testUser = UsersMockData[0];
      const userEmail = testUser.email;
      const user = await userController.getUser({ email: userEmail });
      expect(user).toEqual(testUser);
    });

    it('should return the user by id', async () => {
      const testUser = UsersMockData[1];
      const userId = testUser.id;
      const user = await userController.getUser({ id: userId });
      expect(user).toEqual(testUser);
    });

    it('should return the error if user by id was not found', async () => {
      const invalidId = 'INVALID_ID';

      try {
        const resultById = await userController.getUser({ id: invalidId });
        if (resultById.id !== undefined) throw new Error('Result not empty.');
      } catch (error) {
        expect(error.message).toEqual('User was not found.');
      }
    });

    it('should return the error if user by email was not found', async () => {
      const invalidEmail = 'INVALID_EMAIL';

      try {
        const resultByEmail = await userController.getUser({ email: invalidEmail });
        if (resultByEmail.email !== undefined) throw new Error('Result not empty.');
      } catch (error) {
        expect(error.message).toEqual('User was not found.');
      }
    });

    it('should return the error if id or email was not be passed', async () => {
      try {
        const resultByEmail = await userController.getUser({});
        if (resultByEmail.email !== undefined) throw new Error('Result not empty.');
      } catch (error) {
        expect(error.message).toEqual('User was not found.');
      }
    });
  });

  describe('findUsersByEmail', () => {
    it('should return an array of users which email contains the given characters', async () => {
      const emailCharacters = 'testu';
      const selfUserEmail = UsersMockData[0].email;
      const result = await userController.findUsersByEmail({ email: emailCharacters, selfEmail: selfUserEmail });

      expect(result).toHaveLength(4);
    });

    it('should return the error if users was not found', async () => {
      const invalidEmail = 'INVALID_EMAIL';
      const selfUserEmail = UsersMockData[0].email;
      try {
        const result = await userController.findUsersByEmail({ email: invalidEmail, selfEmail: selfUserEmail });

        if (result) throw new Error('Result is not empty.');
      } catch (error) {
        expect(error.message).toEqual('Users was not found.');
      }
    });
  });

  describe('createUser', () => {
    it('should return correct user data', async () => {
      const newUserData = {
        email: 'TEST_USER_EMAIL',
        name: 'TEST_USER_NAME',
        surname: 'TEST_USER_SURNAME',
        password: 'TEST_USER_PASS',
      };
      const newUser = await userController.createUser(newUserData);

      expect(newUser.email).toEqual(newUserData.email);
      expect(newUser.name).toEqual(newUserData.name);
      expect(newUser.surname).toEqual(newUserData.surname);
      expect(newUser.password.length).toBeDefined();
    });

    it('should return error if user already exists', async () => {
      const newUserData = {
        email: UsersMockData[0].email,
        name: 'TEST_USER_NAME',
        surname: 'TEST_USER_SURNAME',
        password: '',
      };
      try {
        const newUser = await userController.createUser(newUserData);
        if (newUser && newUser.email) throw new Error('User service not return error');
      } catch (error) {
        expect(error.message).toEqual('User already exists.');
      }
    });

    it('should return error if data is not correct', async () => {
      const newUserData = {
        email: 'TEST_USER_EMAIL_1',
        name: 'TEST_USER_NAME',
        surname: 'TEST_USER_SURNAME',
        password: '',
      };
      try {
        const newUser = await userController.createUser(newUserData);
        if (newUser) throw new Error('Result not return an error');
      } catch (error) {
        expect(error.message).toEqual('User passowrd must be at least 3 characters.');
      }
    });
  });

  describe('verifyUser', () => {
    it('should return true if user was be verified', async () => {
      const result = await userController.verifyUser({ email: 'TEST_USER_EMAIL', password: 'TEST_USER_PASS' });
      expect(result).toEqual(true);
    });

    it('should return false if user was not verified', async () => {
      const result = await userController.verifyUser({ email: 'TEST_USER_EMAIL', password: 'INVALID_PASS' });
      expect(result).toEqual(false);
    });

    it('should return error if user was not found', async () => {
      try {
        const result = await userController.verifyUser({ email: 'INVALID_EMAIL', password: 'INVALID_PASS' });
        if (result) throw new Error('Result not empty;');
      } catch (error) {
        expect(error.message).toEqual('User was not found.');
      }
    });
  });
});
