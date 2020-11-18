
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class SignUpInput {
    email: string;
    name: string;
    surname: string;
    password: string;
}

export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export class User implements BaseEntity {
    id: string;
    email: string;
    name: string;
    surname: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
}

export class Session implements BaseEntity {
    id: string;
    accessToken: string;
    refreshToken: string;
    createdAt: string;
    updatedAt: string;
}

export class NewUser {
    user: User;
    session: Session;
}

export abstract class IQuery {
    abstract user(email: string): User | Promise<User>;

    abstract users(): User[] | Promise<User[]>;
}

export abstract class IMutation {
    abstract signUp(input: SignUpInput): NewUser | Promise<NewUser>;
}
