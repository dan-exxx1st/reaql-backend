import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { User } from 'shared/models/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern({ type: 'get-users' })
  public async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @MessagePattern({ type: 'get-user' })
  public async getUser(data: { id?: string; email?: string }) {
    return this.userService.find(data);
  }

  @MessagePattern({ type: 'create-user' })
  public async createUser(data): Promise<User | Error> {
    const result = await this.userService.create(data);
    return result;
  }

  @MessagePattern({ type: 'verify-users' })
  public async verifyUser(data: { email: string; password: string }) {
    return this.userService.verifyUser(data);
  }
}
