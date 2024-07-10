import serverConfig from '@src/configs/server.config';
import { Request, Response, NextFunction } from 'express';
import authService from '@src/services/auth.service';
import userService from '@src/services/user.service';
import BadRequestError from '@src/errors/badRequest.error';

class MeController {
  protected async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        body: { currentPassword, newPassword },
      } = req;

      const user = await userService.getById(req.user.id, true);
      const checkPassword = authService.comparePassword(currentPassword, user.password);
      serverConfig.DEBUG(checkPassword);

      if (!checkPassword) throw new BadRequestError('Invalid current password');

      const updateUser = await userService.changeUserPassword(newPassword, req.user.id);

      res.status(200).json({
        message: 'Password changed successfully',
        data: updateUser,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error at me controller change password method: ${error}`);
      next(error);
    }
  }
}

export default MeController;
