import * as Bull from 'bull';

export const excelQueue = new Bull('excel-import-export');
