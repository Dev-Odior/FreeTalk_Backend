import BadRequestError from '@src/errors/badRequest.error';
import { NextFunction, Request, Response } from 'express';
import authService from '@src/services/auth.service';
import serverConfig from '@src/configs/server.config';
import NotFoundError from '@src/errors/notFound.error';

class AuthMiddleware {
  public async validateUserAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization) throw new NotFoundError('No token provided');

      let token: string;

      if (authorization.includes('Bearer ')) {
        [, token] = authorization.split(' ');
      } else {
        token = authorization;
      }

      if (!token) throw new BadRequestError('No token provided');

      const { payload } = authService.verifyAccessToken(token);

      req.user = payload;
      next();
    } catch (error) {
      serverConfig.DEBUG(`Error in the auth middleware validate user access middleware: ${error}`);
      next(error);
    }
  }
}

export default new AuthMiddleware();
