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

export class SignInInput {
  email: string;
  password: string;
}

export class RefreshTokenInput {
  userId: string;
  email: string;
  refreshToken: string;
}

export class User {
  id: string;
  email: string;
  name: string;
  surname: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export class Session {
  id: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
}

export class UserAndSession {
  user: User;
  session: Session;
}

export abstract class IQuery {
  abstract user(email: string): User | Promise<User>;

  abstract users(): User[] | Promise<User[]>;
}

export abstract class IMutation {
  abstract signUp(input: SignUpInput): UserAndSession | Promise<UserAndSession>;

  abstract signIn(input: SignInInput): UserAndSession | Promise<UserAndSession>;

  abstract refreshSession(refreshToken: string): Session | Promise<Session>;
}
