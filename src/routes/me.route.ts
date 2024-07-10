import MeController from '@src/controller/auth/me.controller';
import systemMiddleware from '@src/middleware/system.middleware';
import authValidator from '@src/utils/validators/auth.validator';
import { Router } from 'express';

class MeRoutes extends MeController {
  public router: Router;
  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router
      .route('/change-password')
      .post(
        systemMiddleware.validateRequestBody(authValidator.changePassword),
        this.changePassword,
      );
  }
}

export default new MeRoutes().router;
