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
import { UserLoginParams, UserRegisterParams } from '@controllers/models/UserRequestModel';
import e = require('express');

export async function register(data:UserRegisterParams){
  let user = await User.findOne({
    where:{
      username:data.username
    }
  });
  if(user) return;
  user = User.create({
    name:data.name,
    username:data.username,
    password:data.password,
    role:data.role
  });

}

export async function login(data:UserLoginParams){
  let user: any = await User.findOne({
    where: {
      username:data.username,
    },
  });

  if(!user) return "Invalid credentials";

  if(user.authenticate(data.password,user.password)){
    return "Valid credentials";
  }else{
    return "Invalid credentials";
  }

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
