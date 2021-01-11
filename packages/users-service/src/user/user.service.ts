import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { hash, compare, genSaltSync } from 'bcryptjs';
import { In, Repository } from 'typeorm';
import { formatISO } from 'date-fns';

import { User } from 'shared/models';
import { SignUpInput } from 'shared/graphql';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(userIds: string[]) {
    return await this.userRepository.find({ id: In(userIds) });
  }

  async findUsersByEmail(email: string, selfEmail: string) {
    return await this.userRepository
      .createQueryBuilder()
      .where('email like :email', { email: `%${email}%` })
      .andWhere('email <> :selfEmail', { selfEmail: `${selfEmail}` })
      .getMany();
  }

  async find({ id, email }: { id?: string; email?: string }) {
    if (id) {
      return this.userRepository.findOne({ id });
    } else if (email) {
      return this.userRepository.findOne({ email });
    }

    return undefined;
  }

  async create(user: SignUpInput) {
    const isUser = await this.find({ email: user.email });
    if (!isUser) {
      if (user.password.length < 3) {
        throw new RpcException('User passowrd must be at least 3 characters.');
      } else {
        const id = v4();
        const salt = genSaltSync(10);
        const password = await hash(user.password, salt);
        const newUser = {
          ...user,
          id,
          password,
          avatar: '',
          createdAt: formatISO(Date.now()),
          updatedAt: formatISO(Date.now()),
        };
        await this.userRepository.save(newUser);
        return newUser;
      }
    }

    throw new RpcException('User already exists.');
  }

  async verifyUser({ email, password }: { email: string; password: string }) {
    try {
      const user = await this.find({ email });
      if (user) {
        const verify = await compare(password, user.password);

        return verify;
      }

      throw new RpcException('User was not found.');
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
