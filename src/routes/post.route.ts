import PostController from '@src/controller/post';
import systemMiddleware from '@src/middleware/system.middleware';
import postValidator from '@src/utils/validators/post.validator';
import { Router } from 'express';

class PostRoutes extends PostController {
  router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router
      .route('/')
      .get(this.index)
      .post(systemMiddleware.validateRequestBody(postValidator.create), this.create);

    this.router
      .route('/:postId')
      .get(systemMiddleware.formatRequestParamsId('postId'), this.get)
      .delete(systemMiddleware.formatRequestParamsId('postId'), this.delete)
      .put(
        systemMiddleware.formatRequestParamsId('postId'),
        systemMiddleware.validateRequestBody(postValidator.update),
        this.update,
      );
  }
}

export default new PostRoutes().router;
