import { exportToExcelFileQueue } from '@services/todo.service';
import * as colors from 'colors/safe';
import { Server  } from 'socket.io';
import { io } from './index';
export {io}
export class Socket{

  public static getIo(){
    return io;
  }

  constructor(){
    
  }

  public socket(){
    io.on('connection', (socket) => {
      console.log(colors.yellow(colors.underline('User has been connected...')));
  
      socket.on('getDownloadLink', (userId: string, requestPage: number, limit: number) => {
        console.log(requestPage, limit);
        exportToExcelFileQueue(userId, requestPage, limit);
      });
  
      socket.on('client', (message: string) => {});
  
      socket.on('hello', (message: string) => {
        console.log(colors.yellow(colors.underline(message)));
      });
  
      socket.on('completed', (message: string) => {
        console.log(colors.blue(colors.underline(message)));
      });
  
      socket.on('failed', (message: string) => {
        console.log(colors.red(colors.underline(message)));
      });
  
      socket.on('active', (message: string) => {
        console.log(colors.green(colors.underline(message)));
      });
    });
  }

}


