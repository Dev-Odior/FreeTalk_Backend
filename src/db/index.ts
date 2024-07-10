import { Sequelize, Options } from 'sequelize';
import dbConfig from '@src/configs/db.config';
import serverConfig from '@src/configs/server.config';
import { initModels } from '@src/models';

class DB {
  private options: Options;
  private connection: Sequelize;

  constructor() {
    this.options = {
      logging: ['development', 'staging'].includes(serverConfig.NODE_SERVER_ENVIRONMENT)
        ? console.log
        : false,
      dialect: 'mysql',
    };
  }

  public async connectDB() {
    console.log(dbConfig.DB_NAME, dbConfig.USER_NAME, dbConfig.PASSWORD);
    try {
      this.connection = new Sequelize(
        dbConfig.DB_NAME,
        dbConfig.USER_NAME,
        dbConfig.PASSWORD,
        this.options,
      );

      // this.connection.sync({ alter: true });
      this.connection.sync({ force: true });

      initModels(this.connection);

      serverConfig.DEBUG(`Successfully connected to the database`);
      return this.connection;
    } catch (error) {
      serverConfig.DEBUG(`Failed to connect to the database with error : ${error}`);
      throw error;
    }
  }

  public async close() {
    try {
      if (this.connection) {
        await this.connection.close();
        serverConfig.DEBUG(`Database connection successfully closed`);
      }
    } catch (error) {
      serverConfig.DEBUG(`Failed to close the database: ${error}`);
    }
  }
}

export default new DB();
