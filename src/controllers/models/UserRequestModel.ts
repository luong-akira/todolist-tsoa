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

export interface UserRegisterParams{
  name:string;
  username:string;
  password:string;
  role:string;
}

export const BasicUserSchema = Joi.object({
  user_name: Joi.string().required().label('Tên đăng nhập'),
  password: Joi.string().trim().required(),
});
