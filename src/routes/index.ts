import serverConfig from '@src/configs/server.config';
import { Router, Request, Response } from 'express';
import authRoute from './auth.route';
import meRoute from './me.route';
import authMiddleware from '@src/middleware/auth.middleware';
import userRoute from './user.route';
import systemMiddleware from '@src/middleware/system.middleware';
import postRoute from './post.route';
import imageRoute from './image.route';

class Routes {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get('/', (req: Request, res: Response) => {
      return res.status(200).json({
        message: `Welcome to Freetalk backend`,
        data: {
          environment: serverConfig.NODE_SERVER_ENVIRONMENT,
          version: '1.0.0',
        },
      });
    });

    this.router.use(systemMiddleware.formatRequestQuery);
    this.router.use('/auth', authRoute);
    this.router.use('/me', authMiddleware.validateUserAccess, meRoute);
    this.router.use('/user', userRoute);
    this.router.use('/post', authMiddleware.validateUserAccess, postRoute);
    this.router.use('/post/image', authMiddleware.validateUserAccess, imageRoute);
  }
}

export default new Routes().router;
