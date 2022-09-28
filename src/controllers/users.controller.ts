import { IS_ACTIVE, apiCode, AppError, PRODUCT_MEDIA_TYPE } from '@commons/constant';
import { ApplicationController } from './';
import { handlePagingMiddleware } from '@middleware/pagingMiddleware';
import Joi from '../helpers/validationHelper';
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
} from './models/UserRequestModel';
// import { AuthorizedUser, MulterRequest } from '@commons/types';
import * as userService from '@services/user.service';

// import db from '@models';
// const { sequelize, Sequelize, User} = db.default;
// const { Op } = Sequelize;
const db = require('@models');
const { sequelize, Sequelize, User } = db.default;
// import { sequelize } from '@config/sequelize';
const { Op } = Sequelize;

//const { sequelize, Sequelize, User } = db.default;
//const { Op } = Sequelize;
import axios from 'axios';
// import https from 'https';

// interface MulterRequest extends express.Request {
//   file: any;
// }

@Route('users')
@Tags('user')
export class UsersController extends ApplicationController {
  constructor() {
    super('User');
  }

  @Post('/register')
  public async register(@Request() request: any) {
    await uploadMiddleware.handleSingleFile(request, 'avatar', PRODUCT_MEDIA_TYPE.IMAGE);
    let avatar = request.file?.path;

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

    if (BasicUserRegisterSchema.validate(userRegisterParams).error) {
      throw new Joi.ValidationError(
        'Vlidation error',
        BasicUserRegisterSchema.validate(userRegisterParams).error.details,
        null,
      );
    }

    let user = await userService.register(userRegisterParams);
    return user;
  }

  @Post('/login')
  public async login(@Body() loginParams: UserLoginParams) {
    if (BasicUserLoginSchema.validate(loginParams).error) {
      throw new Joi.ValidationError('Vlidation error', BasicUserLoginSchema.validate(loginParams).error.details, null);
    }
    return userService.login(loginParams);
  }
  // @Get()
  // async getAllUser(@Request() request: any): Promise<SuccessResponseModel<any>> {
  //   return userService.getAllUsers();
  // }

  // @Post('/register')
  // public async registerFormData(@Request() request: express.Request): Promise<SuccessResponseModel<any>> {
  //   const bodyData = request.body;
  //   return userService.registerFormData(bodyData);
  // }

  // @Get('/:id')
  // async getUserById(@Request() request: express.Request): Promise<SuccessResponseModel<any>> {
  //   const data = request.params.id;
  //   return userService.getUserById(data);
  // }

  // @Patch('/:id')
  // async updateUser(@Request() request: express.Request): Promise<SuccessResponseModel<any>> {
  //   const id = request.params.id;
  //   const { role } = request.body;
  //   return userService.updateUser(id, role);
  // }

  // @Delete('/:id')
  // async deleteUser(@Request() request: express.Request): Promise<SuccessResponseModel<any>> {
  //   const id = request.params.id;
  //   return userService.deleteUser(id);
  // }

  // @Put('/login')
  // public async login(@Body() requestBody: UserLoginParams): Promise<SuccessResponseModel<any>> {
  //   const foundUser = await User.findOne({ where: { user_name: requestBody.user_name } });
  //   if (!foundUser || !foundUser.authenticate(requestBody.password)) {
  //     throw new AppError(apiCode.LOGIN_FAIL);
  //   }
  //   const data = await super._update(
  //     { token: foundUser.generateToken(), last_login_date: new Date() },
  //     { where: { id: foundUser.id } },
  //   );
  //   const updatedUser = await this._findOne({ where: { id: foundUser.id } });
  //   return withSuccess(updatedUser);
  // }

  //   @Post('/register')
  //   public async registerFormData(@Request() request: express.Request): Promise<SuccessResponseModel<any>> {
  //     const bodyData = request.body;
  //     const createdUser = await sequelize.transaction(async (transaction) => {
  //       const user = await User.create(
  //         {
  //           user_name: bodyData.user_name,
  //           password: bodyData.password,
  //         },
  //         { transaction },
  //       );
  //       return user;
  //     });
  //     return createdUser;
  //   }

  //   @Security('jwt')
  //   @Get('/info')
  //   public async getAuthorizedUserInfo(@Request() request: any): Promise<SuccessResponseModel<any>> {
  //     const loginUser = request.user.data;

  //     const foundUser = await User.findOne({ where: { id: loginUser.id } });
  //     if (!foundUser) {
  //       throw new AppError(apiCode.DATA_NOT_EXIST);
  //     }
  //     return withSuccess(foundUser);
  //   }

  //   @Security('jwt')
  //   @Get('/list')
  //   public async getListUser(@Request() request: any): Promise<SuccessResponseModel<any>> {
  //     return withSuccess(userService.getAllUsers());
  //   }
}
