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

console.log(PORT);
export class Server {
  private app: Express;

  constructor() {
    this.app = express();

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

    this.app.use(morgan('combined'));
    this.app.listen(PORT, () => {
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
