import debug from 'debug';
import { config } from 'dotenv';

config();

class ServerConfig {
  public PORT = process.env.PORT ? Number(process.env.PORT) : 3009;
  public NODE_SERVER_ENVIRONMENT = process.env.NODE_SERVER_ENVIRONMENT
    ? process.env.NODE_SERVER_ENVIRONMENT
    : 'development';
  public DEBUG = this.NODE_SERVER_ENVIRONMENT === 'development' ? debug('dev') : console.log;
}

export default new ServerConfig();
