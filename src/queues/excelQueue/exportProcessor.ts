import { exportToExcelStream } from '@services/todo.service';
const db = require('@models');
const { sequelize, Sequelize, User, ImportExport } = db.default;

const threadSleep = async (milliseconds) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, milliseconds);
  });
};

export default async function (job: any) {
  const { userId, requestPage, limit } = job.data;
  console.log(`export process id is ${process.pid}`);

  await ImportExport.create({
    jobId: job.id,
    userId,
    type: 'export',
    status: 'active',
    file: '',
  });

  await threadSleep(5000);

  return await exportToExcelStream(userId, requestPage, limit);
}
