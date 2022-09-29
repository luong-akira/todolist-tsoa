import { exportToExcelStream, importFromExcelStream } from '@services/todo.service';
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
  const { userId, file, sheetNum } = job.data;
  console.log(`Import process id is ${process.pid}`);

  await ImportExport.create({
    jobId: job.id,
    userId,
    type: 'import',
    status: 'active',
    file: '',
  });

  await threadSleep(5000);

  return await importFromExcelStream(userId, file, sheetNum);
}
