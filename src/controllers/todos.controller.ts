import { ApplicationController } from './';

import { Body, Request, Get, Post, Put, Query, Route, Delete, Tags, Security, Patch } from 'tsoa';
import * as todoService from '@services/todo.service';
import { CreateTodoParams, UpdateTodoParams } from './models/TodoRequestModel';
import { handlePagingMiddleware } from '@middleware/pagingMiddleware';
const db = require('@models');
const { sequelize, Sequelize, User } = db.default;
const { Op } = Sequelize;
import * as uploadMiddleware from '@middleware/uploadMiddleware';
import { getFullUrl, PRODUCT_MEDIA_TYPE } from '@commons/constant';
import { socketServer } from '@config/socket';

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
    let { page, limit, offset } = handlePagingMiddleware(request);
    return todoService.getAllTodos(userId, page, limit);
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

  @Delete('/{todoId}')
  @Security('jwt')
  public async deleteTodo(@Request() request: any, todoId: number) {
    let userId = request.user.data.id;
    return todoService.deleteTodo(userId, todoId);
  }

  @Post('/importFromExcelStream')
  @Security('jwt')
  public async importToExcelStream(@Request() request: any) {
    await uploadMiddleware.handleSingleFile(request, 'excel', PRODUCT_MEDIA_TYPE.OTHER);
    let userId = request.user.data.id;
    console.log(userId);
    todoService.importFromExcelStream(userId, request.file);
  }

  @Post('/exportToExcelStream')
  @Security('jwt')
  public async exportToExcelStream(@Request() request: any) {
    let userId = request.user.data.id;
    let { page, limit, offset } = handlePagingMiddleware(request);
    let relativePath = await todoService.exportToExcelStream(userId, page, limit);
    return getFullUrl(relativePath);
  }

  @Post('/importFromExcelStreamQueue')
  @Security('jwt')
  public async importToExcelStreamQueue(@Request() request: any) {
    await uploadMiddleware.handleSingleFile(request, 'excel', PRODUCT_MEDIA_TYPE.OTHER);
    let userId = request.user.data.id;
    todoService.importFromExcelFileQueue(userId, request.file, 1);

    return { message: 'File is processing' };
  }

  @Post('/exportToExcelStreamQueue')
  @Security('jwt')
  public async exportToExcelStreamQueue(@Request() request: any) {
    let userId = request.user.data.id;
    let { page, limit, offset } = handlePagingMiddleware(request);

    await todoService.exportToExcelFileQueue(userId, page, limit);
    return { message: 'File is processing' };
  }
}
