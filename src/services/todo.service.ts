import { CreateTodoParams, UpdateTodoParams } from '@controllers/models/TodoRequestModel';

const db = require('@models');
const { sequelize, Sequelize, Todo, User } = db.default;

export async function getAllTodos(userId: string) {
  let todos = await Todo.findAll({
    where: {
      UserId: userId,
    },
  });
  return todos;
}

export async function createTodo(createTodoParams: CreateTodoParams, userId: string) {
  let todo = await Todo.create({
    ...createTodoParams,
    UserId: userId,
  });

  return todo;
}

export async function updateTodo(data: UpdateTodoParams, userId: string, id: number) {
  let todo = await Todo.findOne({
    where: {
      id,
      UserId: userId,
    },
  });

  if (!todo) return;

  todo.title = data.title;
  todo.body = data.body;
  todo.status = data.status;

  await todo.save();

  return todo;
}
