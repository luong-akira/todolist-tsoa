import 'module-alias/register';
import * as express from 'express';
import * as winston from 'winston';
import * as morgan from 'morgan';
import * as cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { Express } from 'express';
import * as routes from './routes';
import { environment } from './config/';
import * as startSetup from '../setup';
import { RESOURCES_DIRNAME } from '@commons/constant';
const PORT: number = environment.port || 3000;
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { createServer } from 'http';
import { excelQueue } from './queues/registerQueue';

import { socketServer } from '@config/socket';
import { exportToExcelFileQueue } from '@services/todo.service';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(excelQueue)],
  serverAdapter: serverAdapter,
});

export class Server {
  private app: Express;
  private httpServer;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    socketServer.start(this.httpServer);
    this.app.use(cors());
    this.app.use(
      urlencoded({
        extended: true,
      }),
    );

    this.app.use(json());
    this.app.use('/uploads', express.static('uploads'));
    this.app.use(`/${RESOURCES_DIRNAME}`, express.static(`${RESOURCES_DIRNAME}`));
    this.app.use(express.static('public'));
    this.app.use(
      cors({
        optionsSuccessStatus: 200,
      }),
    );

    socketServer.io.on('connection', (socket) => {
      console.log('User has been connected');
      socket.on('getDownloadLink', (userId, page, limit) => {
        exportToExcelFileQueue(userId, page, limit);
      });
    });

    this.app.use(morgan('combined'));
    this.app.use('/admin/queues', serverAdapter.getRouter());
    this.app.get('/index', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    this.httpServer.listen(PORT, () => {
      winston.log('info', '--> Server successfully started at port %d', PORT);
    });

    routes.initRoutes(this.app);
  }

  getApp() {
    return this.app;
  }
}

new Server();

startSetup();
