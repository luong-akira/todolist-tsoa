import { IS_ACTIVE } from '@commons/constant';

const db = require('@models');
const { sequelize, Sequelize, User, Todo } = db.default;
const { Op } = Sequelize;
import {
  SuccessResponseModel,
  withSuccess,
  supplierNotFound,
  successfulDelete,
  Success,
  // withPagingSuccess,
} from '@controllers/models/BaseResponseModel';
import { HostNotFoundError } from 'sequelize/types';
// from './models/BaseResponseModel';
import {
  BasicUserLoginSchema,
  BasicUserRegisterSchema,
  UserLoginParams,
  UserRegisterParams,
  UserUpdateParams,
} from '@controllers/models/UserRequestModel';
import e = require('express');
import Joi = require('joi');
import { excelQueue } from '@queues/excelQueue/excelQueue';

export async function register(data: UserRegisterParams) {
  if (BasicUserRegisterSchema.validate(data).error) {
    throw new Joi.ValidationError('Vlidation error', BasicUserRegisterSchema.validate(data).error.details, null);
  }

  let user: any = await User.findOne({
    where: {
      username: data.username,
    },
  });

  if (user) throw new Error('User has been existed');
  user = await User.create({
    ...data,
  });

  let token = user.generateToken();

  return {
    name: user.name,
    username: user.username,
    avatar: user.avatar,
    role: user.role,
    token,
  };
}

export async function login(data: UserLoginParams) {
  if (BasicUserLoginSchema.validate(data).error) {
    throw new Joi.ValidationError('Vlidation error', BasicUserLoginSchema.validate(data).error.details, null);
  }

  const user: any = await User.findOne({
    where: {
      username: data.username,
    },
  });

  if (!user) throw new Error('Invalid credentials');

  if (!user.authenticate(data.password, user.password)) throw new Error('Invalid credentials');

  return {
    name: user.name,
    username: user.username,
    role: user.role,
    avatar: user.avatar,
    token: user.generateToken(),
  };
}

export async function update(userId: string, userUpdateParams: UserUpdateParams) {
  let user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error('User does not exist');
  user.name = userUpdateParams.name || user.name;
  user.username = userUpdateParams.username || user.username;
  user.avatar = userUpdateParams.avatar || user.avatar;
  user.role = userUpdateParams.role || user.role;

  if (BasicUserRegisterSchema.validate(user).error) {
    throw new Joi.ValidationError('Vlidation error', BasicUserRegisterSchema.validate(user).error.details, null);
  }

  await user.save();
  return user;
}

export async function getAllUsers(userLimit: number, userPage: number, todoLimit: number) {
  let userCount = await User.count({ where: { role: 'user' } });
  let totalPage = Math.ceil(userCount / userPage);

  let users: any = await User.findAll({
    where: {
      role: 'user',
    },
    attributes: ['id', 'name', 'avatar', 'username'],
    include: [
      {
        model: Todo,
        // limit: todoLimit,
      },
    ],
    limit: userLimit,
    offset: (userPage - 1) * userLimit,
  });

  console.log(users);

  let userArr = users.map((user: any) => user.getDataValue('id'));

  let todos: any = await Todo.findAll({
    where: {
      UserId: {
        [Op.in]: userArr,
      },
    },

    attributes: ['user_id', [sequelize.fn('COUNT', sequelize.col('id')), 'todoCount']],
    group: ['user_id'],
  });

  const todoArr: any[] = todos.map((todo: any) => todo.dataValues);

  const map = new Map(todoArr.map((todo) => [todo.user_id, todo.todoCount]));

  users.forEach((user: any) => {
    user.dataValues.todoCount = map.get(user.getDataValue('id')) || 0;
  });

  return { data: users, page: userPage, totalPage, limit: userLimit, todoLimit };
}
