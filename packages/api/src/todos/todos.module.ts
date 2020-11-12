import { Module } from '@nestjs/common';
import { TodosResolver } from './todos.resolver';
import { TodoService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from 'src/models/todo.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Todo])],
    providers: [TodosResolver, TodoService],
    exports: [TypeOrmModule],
})
export class TodosModule {}
