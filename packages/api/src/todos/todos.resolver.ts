import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { TodoService } from './todos.service';

@Resolver('Todos')
export class TodosResolver {
    constructor(private todoService: TodoService) {}

    @Query()
    async todos() {
        return this.todoService.findAll();
    }

    @Mutation()
    async createTodo(@Args('text') text: string) {
        return this.todoService.create(text);
    }
}
