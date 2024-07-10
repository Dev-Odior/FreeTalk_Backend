import { NextFunction, Request, Response } from 'express';
import serverConfig from '@src/configs/server.config';
import authService from '@src/services/auth.service';
import BadRequestError from '@src/errors/badRequest.error';
import userService from '@src/services/user.service';

class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        body: { email, firstName, lastName, password },
      } = req;

      const data = await authService.signUp({ email, firstName, lastName, password });

      res.status(200).json({
        message: 'User created successfully',
        data: data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error ocurred at auth controller signUp method: ${error}`);
      next(error);
    }
  }

  protected async login(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        body: { email, password },
      } = req;

      const result = await authService.login({ email, password });

      res.status(200).json({
        message: 'User logged in successfully',
        data: result,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in the login auth controller login method : ${error}`);
      next(error);
    }
  }

  protected async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const {
        body: { email },
      } = req;

      const result = await authService.forgotPassword(email);

      return res.status(200).json({
        message: 'Check you mail to reset password',
        data: { url: result },
      });
    } catch (error) {
      serverConfig.DEBUG(`Error occurred in auth controller forgot password controller :${error}`);
      next(error);
    }
  }

  protected async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        body: data,
        query: { uid: userId, token },
      } = req;

      if (!userId && !token) {
        throw new BadRequestError('You must provide an uid and token');
      }

      const result = await userService.resetUserPassword(Number(userId), token as string, data);

      res.status(200).json({
        message: 'Password successfully updated',
        data: result,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error occurred at auth controller reset password method: ${error}`);
      next(error);
    }
  }

  protected async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      res.send('change password hit');
    } catch (error) {
      serverConfig.DEBUG(`Error occurred in auth controller change password method:${error}`);

      next(error);
    }
  }
}

export default AuthController;
