
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateUserInput {
    email: string;
    name: string;
    surname: string;
    password: string;
}

export class User {
    id: string;
    email: string;
    name: string;
    surname: string;
    avatar: string;
}

export abstract class IQuery {
    abstract user(email: string): User | Promise<User>;

    abstract users(): User[] | Promise<User[]>;
}

export abstract class IMutation {
    abstract createUser(input: CreateUserInput): User | Promise<User>;
}
