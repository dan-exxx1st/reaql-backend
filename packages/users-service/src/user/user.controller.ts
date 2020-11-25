import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SignUpInput } from 'shared/graphql';

import { User } from 'shared/models/user.entity';
import { FIND_ALL_USERS_TYPE, FIND_USER_TYPE, CREATE_USER_TYPE, VERIFY_USER_TYPE } from 'shared/services/types/user';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern(FIND_ALL_USERS_TYPE)
  public async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @MessagePattern(FIND_USER_TYPE)
  public async getUser(data: { id?: string; email?: string }) {
    return this.userService.find(data);
  }

  @MessagePattern(CREATE_USER_TYPE)
  public async createUser(data: SignUpInput): Promise<User | Error> {
    const result = await this.userService.create(data);
    return result;
  }

  @MessagePattern(VERIFY_USER_TYPE)
  public async verifyUser(data: { email: string; password: string }) {
    return this.userService.verifyUser(data);
  }
}
