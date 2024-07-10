import { QueryOpts } from '@src/interface/functions.interface';
import User from '@src/models/user.model';

declare module 'express' {
  export interface Request {
    queryOpts?: QueryOpts;
    user?: Partial<User>;
    paramsIds?: {
      [key: string]: number;
    };
  }
}
