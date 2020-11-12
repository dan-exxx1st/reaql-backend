
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class Todo {
    id: string;
    text: string;
    done: boolean;
}

export abstract class IQuery {
    abstract todos(): Todo[] | Promise<Todo[]>;
}

export abstract class IMutation {
    abstract createTodo(text: string): Todo | Promise<Todo>;
}
