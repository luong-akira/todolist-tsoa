import { ApplicationController } from './';

import { Body, Request, Get, Post, Put, Query, Route, Delete, Tags, Security, Patch } from 'tsoa';
import * as todoService from '@services/todo.service';
import { CreateTodoParams, UpdateTodoParams } from './models/TodoRequestModel';
import { pagingMiddleware } from '@middleware/pagingMiddleware';
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
  @Security('jwt')
  public async getAllTodos(@Request() request: any) {
    let userId = request.user.data.id;
    return todoService.getAllTodos(userId);
  }

  @Post()
  @Security('jwt')
  public async createTodo(@Body() createTodoParams: CreateTodoParams, @Request() request: any) {
    let userId = request.user.data.id;
    return todoService.createTodo(createTodoParams, userId);
  }

  @Put('/{todoId}')
  @Security('jwt')
  public async updateTodo(@Body() updateTodoParams: UpdateTodoParams, @Request() request: any, todoId: number) {
    let userId = request.user.data.id;
    return todoService.updateTodo(updateTodoParams, userId, todoId);
  }
}
