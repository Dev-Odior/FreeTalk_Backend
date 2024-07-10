import ImageController from '@src/controller/image';
import systemMiddleware from '@src/middleware/system.middleware';
import { Router } from 'express';

class ImageRoute extends ImageController {
  public router: Router;
  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router
      .route('/:imageId')
      .delete(systemMiddleware.formatRequestParamsId('imageId'), this.delete).put(systemMiddleware.formatRequestParamsId('imageId'), this.update)
  }
}

export default new ImageRoute().router;
