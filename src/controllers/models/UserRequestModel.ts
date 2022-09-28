import Joi from '../../helpers/validationHelper';
// import { IS_ACTIVE, apiCode} from '@commons/constant';

export interface UserRequestModel {
  user_name: string;
}

export interface UserWithPasswordModel extends UserRequestModel {
  password: string;
}
export interface UserLoginParams {
  username: string;
  password: string;
}

export interface UserRegisterParams {
  name: string;
  username: string;
  password: string;
  role?: string;
  avatar?: string;
}

export interface UserUpdateParams {
  name?: string;
  username?: string;
  role?: string;
  avatar?: string;
}

export const BasicUserRegisterSchema = Joi.object({
  name: Joi.string().required().min(4),
  username: Joi.string().required().min(3),
  password: Joi.string().trim().required().min(3),
});

export const BasicUserLoginSchema = Joi.object({
  username: Joi.string().required().min(3),
  password: Joi.string().trim().required().min(3),
});
