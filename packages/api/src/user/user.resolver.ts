import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserInput } from 'shared/graphql';

@Resolver()
export class UserResolver {
    constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

    @Query()
    async users() {
        const users = await this.client.send({ type: 'get-users' }, {});
        return users.toPromise();
    }

    @Mutation()
    async createUser(@Args('input') CreateUserData: CreateUserInput) {
        const pattern = { type: 'create-user' };

        const newUser = await this.client.send(pattern, CreateUserData);

        return newUser;
    }
}
