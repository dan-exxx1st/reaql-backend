import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from 'src/models/todo.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todosRepository: Repository<Todo>,
    ) {}

    create(text: string) {
        const id = uuidv4();
        const newTodo: Todo = { id: id, text, done: false };
        this.todosRepository.save(newTodo);
        return newTodo;
    }

    findAll(): Promise<Todo[]> {
        return this.todosRepository.find();
    }
}
