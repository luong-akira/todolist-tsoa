import { IS_ACTIVE } from '@commons/constant';

const db = require('@models');
const { sequelize, Sequelize, User } = db.default;
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

// export async function getAllUsers(): Promise<SuccessResponseModel<any>> {
//   const listUsers = await User.findAll({
//     attributes: ['id', 'user_name', 'role', 'createdAt'],
//   });
//   return listUsers;
// }

// export async function registerFormData(data: UserLoginParams): Promise<SuccessResponseModel<any>> {
//   const createdUser = await sequelize.transaction(async (transaction) => {
//     const user = await User.create(
//       {
//         user_name: data.user_name,
//         password: data.password,
//       },
//       { transaction },
//     );
//     return user;
//   });
//   return createdUser;
// }

// export async function getUserById(id: string): Promise<SuccessResponseModel<any>> {
//   const user = await User.findOne({ where: { id: id }, attributes: ['id', 'user_name', 'role', 'createdAt'] });
//   if (user) {
//     return user;
//   } else {
//     return supplierNotFound;
//   }
// }

// export async function updateUser(id: string, role: string): Promise<SuccessResponseModel<any>> {
//   const user = await User.findByPk(id);
//   if (user) {
//     user.role = role;
//     await user.save();
//     return Success;
//   } else {
//     return supplierNotFound;
//   }
// }

// export async function deleteUser(id: string): Promise<SuccessResponseModel<any>> {
//   const user = await User.findByPk(id);
//   if (user) {
//     await User.destroy({ where: { id: id } });
//     return successfulDelete;
//   } else {
//     return supplierNotFound;
//   }
// }

// export async function login(user_name: string, password: string): Promise<SuccessResponseModel<any>> {
//   const user = await User.findOne({ where: { user_name: user_name } });
//   if (user) {

//   }
// }
