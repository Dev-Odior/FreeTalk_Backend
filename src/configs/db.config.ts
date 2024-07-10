import { config } from 'dotenv';
config();

class DBConfig {
  public USER_NAME = process.env.USER_NAME;
  public DB_NAME = process.env.DB_NAME;
  public PASSWORD = process.env.PASSWORD;
}

export default new DBConfig();
