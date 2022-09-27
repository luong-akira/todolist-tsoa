import { ApplicationController } from './';
  
import {
    Body,
    Request,
    Get,
    Post,
    Put,
    Query,
    Route,
    Delete,
    Tags,
    Security,
    Patch,
} from 'tsoa';
import * as todoService from "@services/todo.service"
import { CreateTodoParams } from './models/TodoRequestModel';
const db = require('@models');
const { sequelize, Sequelize, User } = db.default;
const { Op } = Sequelize;

@Route('todos')
@Tags('todo')
export class TodosController extends ApplicationController {
    constructor() {
      super('Todo');
    }
  
    @Get()
    public async getAllTodos(){
      return todoService.getAllTodos();
    }

    @Post()
    public async createTodo(@Body() createTodoParams:CreateTodoParams){
      return todoService.createTodo(createTodoParams);
    }
}
  