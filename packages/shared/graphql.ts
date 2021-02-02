
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
    rememberUser: boolean;
}

export class CreateDialogInput {
    userId: string;
    role: DIALOG_USER_ROLES;
}

export class CreateMessageInput {
    dialogId: string;
    userId: string;
    text?: string;
}

export class UpdateOnlineStatusInput {
    userId: string;
    status: string;
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
    dialogProps: DialogProps[];
    lastMessage?: string;
    lastMessageDate?: string;
    group: boolean;
    createdAt: string;
    updatedAt: string;
}

export class DialogProps {
    id: string;
    user: User;
    userRole: DIALOG_USER_ROLES;
    unreadMessages?: number;
    lastMessageStatus?: MESSAGE_STATUSES;
    createdAt: string;
    updatedAt: string;
}

export class Message {
    id: string;
    user: User;
    dialog: Dialog;
    text: string;
    messageDate: string;
    messageStatus?: MESSAGE_STATUSES;
    createdAt: string;
    updatedAt: string;
}

export class UserAndSession {
    user: User;
    session?: Session;
}

export abstract class IQuery {
    abstract user(email: string): User | Promise<User>;

    abstract searchUsers(email: string, selfEmail: string): User[] | Promise<User[]>;

    abstract dialog(dialogId: string): Dialog | Promise<Dialog>;

    abstract dialogs(userId: string): Dialog[] | Promise<Dialog[]>;

    abstract messages(dialogId: string): Message[] | Promise<Message[]>;
}

export abstract class IMutation {
    abstract signUp(input: SignUpInput): UserAndSession | Promise<UserAndSession>;

    abstract signIn(input: SignInInput): UserAndSession | Promise<UserAndSession>;

    abstract refreshSession(refreshToken: string): Session | Promise<Session>;

    abstract createDialog(input: CreateDialogInput[]): Dialog | Promise<Dialog>;

    abstract createMessage(input?: CreateMessageInput): Message | Promise<Message>;

    abstract updateOnlineStatus(input?: UpdateOnlineStatusInput): User | Promise<User>;
}

export abstract class ISubscription {
    abstract dialogCreated(userId: string): Dialog | Promise<Dialog>;

    abstract dialogUpdated(dialogId: string): Dialog | Promise<Dialog>;

    abstract messageCreated(dialogId: string): Message | Promise<Message>;
}
