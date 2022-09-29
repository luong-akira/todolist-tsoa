import { BasicTodoSchema, CreateTodoParams, UpdateTodoParams } from '@controllers/models/TodoRequestModel';
import Joi = require('joi');
import * as Excel from 'exceljs';
import * as path from 'path';
import { RESOURCES_DIRNAME, ROOT_DIR } from '@commons/constant';
import { excelQueue } from '../queues/registerQueue';
const db = require('@models');
const { Todo, User, ImportExport } = db.default;
import exportProcessor from '../queues/excelQueue/exportProcessor';
import importProcessor from '../queues/excelQueue/importProcessor';

export async function getAllTodos(userId: string, page: number, limit: number) {
  let todoCount = await Todo.count({
    UserId: userId,
  });

  let totalPage = Math.ceil(todoCount / limit);

  let todos = await Todo.findAll({
    where: {
      UserId: userId,
    },
    include: [User],
    offset: (page - 1) * limit,
    limit,
  });
  return { data: todos, page, totalPage, limit };
}

export async function createTodo(createTodoParams: CreateTodoParams, userId: string) {
  if (BasicTodoSchema.validate(createTodoParams).error) {
    throw new Joi.ValidationError('Validation error', BasicTodoSchema.validate(createTodoParams).error.details, null);
  }

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

  if (!todo) throw new Error('Todo does not exist');

  todo.title = data.title || todo.title;
  todo.body = data.body || todo.body;
  todo.status = data.status || todo.status;

  let newTodo = {
    title: todo.dataValues.title,
    body: todo.dataValues.body,
    status: todo.dataValues.status,
  };

  if (BasicTodoSchema.validate(newTodo).error) {
    throw new Joi.ValidationError('Validation error', BasicTodoSchema.validate(newTodo).error.details, null);
  }

  await todo.save();

  return todo;
}

export async function deleteTodo(userId: string, id: number) {
  let todo = await Todo.findOne({
    where: {
      id,
      UserId: userId,
    },
  });

  if (!todo) throw new Error('Todo does not exist');

  await todo.destroy();

  return { id: todo.id };
}

export async function importFromExcelStream(UserId: string, file: any, workSheetNum: number = 1) {
  const options: any = {
    sharedStrings: 'cache',
    hyperlinks: 'cache',
    worksheets: 'emit',
    styles: 'cache',
  };

  const workBookReader = new Excel.stream.xlsx.WorkbookReader(
    path.join(ROOT_DIR, 'uploads', 'other', file.filename),
    options,
  );

  console.log(workBookReader);

  for await (const workSheetReader of workBookReader) {
    for await (const row of workSheetReader) {
      if (row.number <= 1) {
      } else {
        let content: any = {
          title: row.getCell(2).value,
          body: row.getCell(3).value,
        };

        if (row.getCell(4).value) content.status = row.getCell(4).value;

        const todoExist = await Todo.findOne({
          where: {
            title: content.title,
            UserId,
          },
        });

        if (!todoExist) {
          await createTodo(content, UserId);
        } else {
          await updateTodo(content, UserId, parseInt(todoExist.getDataValue('id')));
        }
      }
    }
  }

  return { message: 'Upload successfully' };
}

export async function exportToExcelStream(userId: string, requestPage: number, limit: number) {
  const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.xlsx';

  const options = {
    filename: path.join(ROOT_DIR, `${RESOURCES_DIRNAME}`, filename),
    useStyles: true,
  };

  const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
  const workSheet = workbook.addWorksheet('My sheet');
  let headingRow = workSheet.addRow(['STT', 'ID', 'TITLE', 'BODY', 'STATUS', 'USER ID', 'USERNAME', 'DATE CREATED']);

  headingRow.font = {
    bold: true,
  };

  let hasMoreData = true;

  let page = requestPage;

  let index = 1;

  do {
    const todos = await getAllTodos(userId, page, limit);

    todos.data.forEach((todo) => {
      index += 1;

      workSheet
        .addRow([
          index,
          todo.getDataValue('id'),
          todo.getDataValue('title'),
          todo.getDataValue('body'),
          todo.getDataValue('status'),
          todo.getDataValue('UserId'),
          todo.getDataValue('User').username,
          todo.getDataValue('createdAt').toString(),
        ])
        .commit();
    });

    hasMoreData = page < todos.totalPage;
    page++;
  } while (hasMoreData);

  await workbook.commit();

  return `/${RESOURCES_DIRNAME}/${filename}`;
}

excelQueue.process('export', exportProcessor);
excelQueue.process('import', importProcessor);

export async function importFromExcelFileQueue(userId: string, file: any, sheetNum: number) {
  await excelQueue.add('import', {
    userId,
    file,
    sheetNum,
  });
}

export async function exportToExcelFileQueue(userId: string, requestPage: number, limit: number) {
  console.log(io);

  await excelQueue.add('export', {
    userId,
    requestPage,
    limit,
  });
}

excelQueue.on('active', async (job, result) => {
  if (job.name == 'import') {
    let importJob: any = await ImportExport.findOne({
      where: { userId: job.data.userId, jobId: job.id },
    });

    if (!importJob) return;
    importJob.status = 'active';
    await importJob.save();
  } else if (job.name == 'export') {
    let exportJob: any = await ImportExport.findOne({
      where: { userId: job.data.userId, jobId: job.id },
    });

    if (!exportJob) return;
    exportJob.status = 'active';
    await exportJob.save();
  }
});

excelQueue.on('completed', async (job, result) => {
  if (job.name == 'import') {
    let importJob: any = await ImportExport.findOne({
      where: { userId: job.data.userId, jobId: job.id },
    });

    if (!importJob) return;
    importJob.status = 'completed';
    importJob.file = job.data.file.filename;

    await importJob.save();
  } else if (job.name == 'export') {
    if (job.name == 'export') {
      let exportJob: any = await ImportExport.findOne({
        where: { userId: job.data.userId, jobId: job.id },
      });
      if (!exportJob) return;
      exportJob.status = 'completed';
      exportJob.file = job.returnvalue;

      await exportJob.save();
    }
  }
});

excelQueue.on('failed', async (job, result) => {
  if (job.name == 'import') {
    let importJob: any = await ImportExport.findOne({
      where: { userId: job.data.userId, jobId: job.id },
    });
    if (!importJob) return;
    importJob.status = 'failed';
    await importJob.save();
  } else if ((job.name = 'export')) {
    let exportJob: any = await ImportExport.findOne({
      where: { userId: job.data.userId, jobId: job.id },
    });

    if (!exportJob) return;
    exportJob.status = 'failed';
    await exportJob.save();
  }
});
