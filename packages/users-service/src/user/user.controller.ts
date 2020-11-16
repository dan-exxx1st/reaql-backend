import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateUserInput } from 'shared/graphql';

import { User } from 'shared/models/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @MessagePattern({ type: 'get-users' })
    public async getUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

    @MessagePattern({ type: 'create-user' })
    public async createUser(data: CreateUserInput): Promise<User> {
        return this.userService.create(data);
    }
}
