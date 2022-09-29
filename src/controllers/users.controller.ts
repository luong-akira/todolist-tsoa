import { PRODUCT_MEDIA_TYPE } from '@commons/constant';
import { ApplicationController } from './';
import { handleUerPagingMiddleware } from '@middleware/pagingMiddleware';
import * as uploadMiddleware from '@middleware/uploadMiddleware';

import { Body, Request, Get, Post, Put, Query, Route, Delete, Tags, Security, Patch, UploadedFile } from 'tsoa';
import {
  SuccessResponseModel,
  withSuccess,
  // withPagingSuccess,
} from './models/BaseResponseModel';
import * as express from 'express';
import {
  UserWithPasswordModel,
  UserLoginParams,
  UserRegisterParams,
  BasicUserLoginSchema,
  BasicUserRegisterSchema,
  UserUpdateParams,
} from './models/UserRequestModel';
import * as userService from '@services/user.service';
const db = require('@models');
const { sequelize, Sequelize, User } = db.default;

interface MulterRequest extends express.Request {
  file: any;
}

@Route('users')
@Tags('user')
export class UsersController extends ApplicationController {
  constructor() {
    super('User');
  }

  @Post('/register')
  public async register(@Request() request: MulterRequest) {
    await uploadMiddleware.handleSingleFile(request, 'avatar', PRODUCT_MEDIA_TYPE.IMAGE);
    
    let avatar;
    if(request.file) {
      avatar = `/${request.file.destination.replace('\\', '/')}/${request.file.filename}`;
    }

    let userRegisterParams: UserRegisterParams = {
      name: request.body.name,
      username: request.body.username,
      password: request.body.password,
    };
    if (avatar) {
      userRegisterParams.avatar = avatar;
    }
    if (request.body.role) {
      userRegisterParams.role = request.body.role;
    }
    let user = await userService.register(userRegisterParams);
    return user;
  }

  @Post('/login')
  public async login(@Body() loginParams: UserLoginParams) {
    return userService.login(loginParams);
  }

  @Put('/update')
  @Security('jwt')
  public async updateUser(@Request() request: any) {
    await uploadMiddleware.handleSingleFile(request, 'avatar', PRODUCT_MEDIA_TYPE.IMAGE);
    let avatar = request.file?.path;
    let userId = request.user.data.id;

    let updatedUserParams: UserUpdateParams = {};
    if (request.body.name) updatedUserParams.name = request.body.name;
    if (request.body.username) updatedUserParams.username = request.body.username;
    if (request.body.role) updatedUserParams.role = request.body.role;
    if (avatar) updatedUserParams.avatar = avatar;

    let user = await userService.update(userId, updatedUserParams);
    return user;
  }

  @Get('/allUsers')
  @Security('jwt', ['admin'])
  public async getAllUser(@Request() request: any) {
    let { page, limit, offset, todoLimit } = handleUerPagingMiddleware(request);

    return userService.getAllUsers(limit, page, todoLimit);
  }
}
