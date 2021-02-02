import { v4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { hash, compare, genSaltSync } from 'bcryptjs';
import { In, Repository } from 'typeorm';
import { formatISO } from 'date-fns';

import { Dialog, User } from 'shared/models';
import { SignUpInput } from 'shared/graphql';
import { FIND_ALL_DIALOGS_TYPE } from 'shared/types/dialog';

@Injectable()
export class UserService {
  constructor(
    @Inject('DIALOGS_SERVICES') private readonly dialogService: ClientProxy,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(userIds: string[]): Promise<User[]> {
    return await this.userRepository.find({ id: In(userIds) });
  }

  async findUsersByEmail(email: string, selfEmail: string): Promise<User[]> {
    try {
      const currentUser = await this.find({ email: selfEmail });

      const dialogs = await this.dialogService
        .send<Dialog[]>(FIND_ALL_DIALOGS_TYPE, { userId: currentUser.id })
        .toPromise();

      const users = await this.userRepository
        .createQueryBuilder()
        .where('email like :email', { email: `%${email}%` })
        .andWhere('email <> :selfEmail', { selfEmail: `${selfEmail}` })
        .getMany();

      const filteredUsers = users.filter((user) => {
        const indexUser = dialogs.find((dialog) => dialog.users.find((dialogUser) => dialogUser.id === user.id));

        return indexUser ? false : true;
      });

      return filteredUsers;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async find({ id, email }: { id?: string; email?: string }): Promise<User | undefined> {
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
        const id: string = v4();
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

  async verifyUser({ email, password }: { email: string; password: string }): Promise<boolean> {
    const user = await this.find({ email });
    if (user) {
      const verify = await compare(password, user.password);

      return verify;
    }

    throw new RpcException('User was not found.');
  }

  async updateOnlineStatus(payload: { userId: string; status: string }) {
    const { userId, status } = payload;
    const updatedInfo = await this.userRepository.update({ id: userId }, { online: status });
    if (updatedInfo.affected) {
      const updatedUser = await this.find({ id: userId });
      return updatedUser;
    }
  }
}
