// import { excelQueue } from '@queues/excelQueue/excelQueue';
// // import exportProcessor from "./exportProcessor";
// import importProcessor from '@queues/excelQueue/importProcessor';
// import exportProcessor from '@queues/excelQueue/exportProcessor';
// const db = require('@models');
// const { sequelize, Sequelize, User, ImportExport } = db.default;
// import * as path from 'path';
// import { importFromExcelStream } from '@services/todo.service';

// export default function registerQueueProcess() {
//   excelQueue.process('export', async function (job: any) {
//     const { userId, file, sheetNum } = job.data;
//     console.log(`Process id is ${process.pid}`);

//     await ImportExport.create({
//       jobId: job.id,
//       userId: job.data.userId,
//       type: 'import',
//       status: 'active',
//       file: '',
//     });

//     return await importFromExcelStream(userId, file, sheetNum);
//   });
//   excelQueue.process('import', exportProcessor);
// }
