import UserController from '@src/controller/user';
import systemMiddleware from '@src/middleware/system.middleware';
import userValidator from '@src/utils/validators/user.validator';
import { Router } from 'express';

class UserRoute extends UserController {
  public router: Router;
  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.route('/').get(this.index);

    this.router
      .route('/:userId')
      .get(systemMiddleware.formatRequestParamsId('userId'), this.get)
      .delete(systemMiddleware.formatRequestParamsId('userId'), this.delete)
      .patch(
        systemMiddleware.formatRequestParamsId('userId'),
        systemMiddleware.validateRequestBody(userValidator.update),
        this.update,
      );
  }
}

export default new UserRoute().router;
