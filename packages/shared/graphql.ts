
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum DIALOG_USER_ROLES {
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum MESSAGE_STATUSES {
    SENDED = "SENDED",
    RECIVED = "RECIVED",
    READED = "READED"
}

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

export class CreateDialogInput {
    userId: string;
    role: DIALOG_USER_ROLES;
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

export class Dialog {
    id: string;
    users: User[];
    dialogProps: DialogProps;
    lastMessage: string;
    lastMessageDate: string;
}

export class DialogProps {
    id: string;
    user: User;
    userRole: string;
    unreadMessages: number;
    lastMessageStatus: MESSAGE_STATUSES;
}

export class UserAndSession {
    user: User;
    session: Session;
}

export abstract class IQuery {
    abstract user(email: string): User | Promise<User>;

    abstract dialogs(userId: string): Dialog[] | Promise<Dialog[]>;
}

export abstract class IMutation {
    abstract signUp(input: SignUpInput): UserAndSession | Promise<UserAndSession>;

    abstract signIn(input: SignInInput): UserAndSession | Promise<UserAndSession>;

    abstract refreshSession(refreshToken: string): Session | Promise<Session>;

    abstract createDialog(input: CreateDialogInput[]): Dialog | Promise<Dialog>;
}
