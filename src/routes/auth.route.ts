import { Router } from 'express';
import systemMiddleware from '@src/middleware/system.middleware';
import authValidator from '@src/utils/validators/auth.validator';
import AuthController from '@src/controller/auth/auth.controller';

class AuthRoute extends AuthController {
  public router: Router;
  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router
      .route('/')
      .post(systemMiddleware.validateRequestBody(authValidator.login), this.login);

    this.router
      .route('/register')
      .post(systemMiddleware.validateRequestBody(authValidator.signUp), this.signUp);

    this.router
      .route('/forgot-password')
      .post(
        systemMiddleware.validateRequestBody(authValidator.forgotPassword),
        this.forgotPassword,
      );

    this.router
      .route('/reset-password')
      .post(systemMiddleware.validateRequestBody(authValidator.resetPassword), this.resetPassword);
  }
}

export default new AuthRoute().router;
