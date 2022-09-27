import { CreateTodoParams } from "@controllers/models/TodoRequestModel";

const db = require('@models');
const { sequelize, Sequelize, Todo,User } = db.default;

export async function getAllTodos(){
    let todos = await Todo.findAll({});
    return todos;
}

export async function createTodo(createTodoParams:CreateTodoParams){
    let todo = await Todo.create({
        ...createTodoParams,
        userId:"64718742-0d8b-480c-b86f-04fe39cec7a1"
    })

    return todo;
}