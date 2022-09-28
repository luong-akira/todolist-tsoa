import { Job } from 'bull';
const db = require('@models');
const { sequelize, Sequelize, User, ImportExport } = db.default;
import { exportToExcelStream } from '@services/todo.service';

const sleepThread = async (sleepInMilis: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, sleepInMilis);
  });
};

export default async function (job: Job) {
  const { userId, requestPage, limit } = job.data;
  console.log(`Process id is ${process.pid}`);

  await ImportExport.create({
    jobId: job.id,
    userId: job.data.userId,
    type: 'export',
    status: 'active',
    file: '',
  });
  await sleepThread(5000);

  return await exportToExcelStream(userId, requestPage, limit);
}
