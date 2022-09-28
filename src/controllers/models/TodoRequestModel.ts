import Joi = require('joi');

export interface CreateTodoParams {
  title: string;
  body: string;
  status?: string;
}

export interface UpdateTodoParams {
  title?: string;
  body?: string;
  status?: string;
}

export const BasicTodoSchema = Joi.object({
  title: Joi.string().required().min(3),
  body: Joi.string().required().min(3),
  status: Joi.string().optional(),
});
