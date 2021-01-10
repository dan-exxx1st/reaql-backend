import { Controller } from '@nestjs/common';

import { MessagePattern, RpcException } from '@nestjs/microservices';
import { SignUpInput } from 'shared/graphql';

import { User } from 'shared/models';
import {
  FIND_ALL_USERS_TYPE,
  FIND_USER_TYPE,
  CREATE_USER_TYPE,
  VERIFY_USER_TYPE,
  FIND_USERS_BY_EMAIL,
} from 'shared/types/user';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern(FIND_ALL_USERS_TYPE)
  public async getUsers(payload: { ids: string[] }): Promise<User[]> {
    try {
      const { ids } = payload;
      const users = await this.userService.findAll(ids);
      if (users && users.length > 0) {
        return users;
      }

      throw new RpcException('Users not found.');
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern(FIND_USER_TYPE)
  public async getUser(data: { id?: string; email?: string }) {
    try {
      const user = await this.userService.find(data);
      if (user) {
        return user;
      }

      throw new RpcException('User not found.');
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern(FIND_USERS_BY_EMAIL)
  public async findUsersByEmail(payload: { email: string; selfEmail: string }): Promise<User[] | Error> {
    const { email, selfEmail } = payload;
    const users = await this.userService.findUsersByEmail(email, selfEmail);
    if (users) return users;

    throw new RpcException('Users not found.');
  }

  @MessagePattern(CREATE_USER_TYPE)
  public async createUser(data: SignUpInput): Promise<User | Error> {
    try {
      return this.userService.create(data);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern(VERIFY_USER_TYPE)
  public async verifyUser(data: { email: string; password: string }) {
    try {
      const verifiedUser = await this.userService.verifyUser(data);
      return verifiedUser;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
