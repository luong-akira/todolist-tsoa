import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export class SocketServer {
  public io?: Server;
  name: string;
  constructor() {
    this.name = new Date().toISOString();
    // this.io = { emit: null };
  }
  public start(httpServer: HttpServer) {
    this.io = new Server(httpServer);
    console.log('start', this.io);
  }
}

export const socketServer = new SocketServer();
