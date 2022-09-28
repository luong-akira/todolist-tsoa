import { exportToExcelStream, importFromExcelStream } from '@services/todo.service';
import * as Bull from 'bull';
const db = require('@models');
const { sequelize, Sequelize, User, ImportExport } = db.default;
export const excelQueue = new Bull('excel-import-export');

excelQueue.process('export', async function (job: any) {
  const { userId, requestPage, limit } = job.data;
  console.log(`Process id is ${process.pid}`);

  await ImportExport.create({
    jobId: job.id,
    UserId: job.data.userId,
    type: 'export',
    status: 'active',
    file: '',
  });

  return await exportToExcelStream(userId, requestPage, limit);
});

excelQueue.process('import', async function (job: any) {
  const { userId, file, sheetNum } = job.data;
  console.log(`Process id is ${process.pid}`);

  await ImportExport.create({
    jobId: job.id,
    UserId: job.data.userId,
    type: 'import',
    status: 'active',
    file: '',
  });

  return await importFromExcelStream(userId, file, sheetNum);
});
