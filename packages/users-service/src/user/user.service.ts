import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import { hash, compare, genSaltSync } from 'bcryptjs';

import { In, Repository } from 'typeorm';

import { User } from 'shared/models';
import { formatISO } from 'date-fns';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(userIds: string[]): Promise<User[]> {
    return await this.userRepository.find({ id: In(userIds) });
  }

  async findUsersByEmail(email: string, selfEmail: string): Promise<User[]> {
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

  async create(user): Promise<User | Error> {
    try {
      const isUser = await this.find({ email: user.email });
      if (!isUser) {
        const id = v4();
        const salt = genSaltSync(10);
        const password = await hash(user.password, salt);
        const newUser: User = {
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

      throw new RpcException('User already exists.');
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async verifyUser({ email, password }: { email: string; password: string }) {
    try {
      const user = await this.find({ email });
      return compare(password, user.password) ? true : false;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
