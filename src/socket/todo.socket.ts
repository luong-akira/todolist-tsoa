import { socketServer } from '@config/socket';

const TODO_SOCKET_EVENT = {};

export default class TodoSocket {
  constructor() {}

  public static emitExportComplete(payload) {
    // console.log(SocketServer.io);
    socketServer.io.emit('export-todo:completed', payload);
  }
}
