import serverConfig from '@src/configs/server.config';
import { NextFunction, Request, Response } from 'express';
import userService from '@src/services/user.service';

class UserController {
  protected async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { queryOpts } = req;
      const { users, totalCount } = await userService.index(queryOpts);

      return res.status(200).json({
        message: 'Users retrieved successfully',
        data: { users, totalCount },
      });
    } catch (error) {
      serverConfig.DEBUG(`Error occurred at user controller index method:${error}`);
      next(error);
    }
  }

  protected async get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { userId } = req.paramsIds;
      const user = await userService.get(userId, true);

      return res.status(200).json({
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error occurred a user controller get method:${error}`);
      next(error);
    }
  }

  protected async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramsIds: { userId },
      } = req;

      await userService.delete(userId);

      return res.status(200).json({
        message: 'User deleted successfully',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error occurred at user controller delete method:${error}`);
      next(error);
    }
  }

  protected async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        body,
        paramsIds: { userId },
      } = req;

      const user = await userService.update(userId, body);

      return res.status(200).json({
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error occurred at user controller update method:${error}`);
      next(error);
    }
  }
}

export default UserController;
