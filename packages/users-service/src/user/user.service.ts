import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';

import { Repository } from 'typeorm';

import { User } from 'shared/models/user.entity';
import { CreateUserInput } from 'shared/graphql';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	findAll(): User[] | Promise<User[]> {
		return this.userRepository.find();
	}

	async create(user: CreateUserInput): Promise<User> {
		const id = v4();
		const password = await hash(user.password, 10);
		const newUser: User = { ...user, id, password, avatar: '' };
		this.userRepository.save(newUser);
		return newUser;
	}
}
