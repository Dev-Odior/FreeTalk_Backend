import express, { Application } from 'express';
import { Server } from 'http';
import { Sequelize } from 'sequelize';
import helmet from 'helmet';
import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import serverConfig from './configs/server.config';
import routes from './routes';
import systemMiddleware from './middleware/system.middleware';
import db from './db';

class App {
  private server: Server;
  private db: Sequelize;
  private app: Application;
  private port: number;
  private corsOpts: CorsOptions;

  constructor() {
    this.app = express();
    this.port = serverConfig.PORT;
    this.corsOpts = {
      origin: serverConfig.NODE_SERVER_ENVIRONMENT === 'development' ? '*' : [],
    };

    const signals = ['SIGTERM', 'SIGINT', 'SIGUSR1', 'SIGUSR2'];

    signals.forEach((signal) => {
      process.on(signal, async (error) => {
        serverConfig.DEBUG(`\n Received signal (${signal} to terminate the application ${error})`);
        await this.shutdown();
      });
    });

    this.initializeDatabase();
    this.securityMiddleware();
    this.standardMiddleware();
    this.initializeRoutes();
    this.initializeMiddleware();
  }

  private async initializeDatabase() {
    await db.connectDB();
  }

  private securityMiddleware() {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cors(this.corsOpts));
  }

  private standardMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeMiddleware() {
    this.app.use(systemMiddleware.errorHandler());
  }

  private initializeRoutes() {
    this.app.use(routes);
  }

  private async shutdown(): Promise<void> {
    try {
      if (this.server) {
        return new Promise<void>((resolve) => {
          this.server.close(() => {
            serverConfig.DEBUG('Http server closed');
            resolve();
          });
        });
      }

      // close the sequelize connection here //

      serverConfig.DEBUG(`Server has been completely shutdown \n`);
    } catch (error) {
      console.log('signal shutdown');
    }
  }

  public start() {
    try {
      this.server = this.app.listen(this.port, () => {
        serverConfig.DEBUG(
          `Server is running on http://localhost:${this.port} in ${serverConfig.NODE_SERVER_ENVIRONMENT} \n press CTRL C to stop`,
        );
      });
    } catch (error) {
      serverConfig.DEBUG(`Error connecting to the server!!`);
    }
  }
}

const app = new App();
app.start();
