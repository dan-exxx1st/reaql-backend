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

  describe('findAll', () => {
    it('should return an array of users which have lenght equal 3', async () => {
      const ids = ['1', '2', '3'];
      const getUsersByIds = await userController.getUsers({ ids });
      expect(getUsersByIds).toHaveLength(3);
    });

    it('should return an error if users not found', async () => {
      const ids = ['999', '9999'];
      try {
        const result = await userController.getUsers({ ids });
        if (result.length > 0) throw new Error('Result is not empty.');
      } catch (error) {
        expect(error.message).toEqual('Users not found.');
      }
    });
  });
});
