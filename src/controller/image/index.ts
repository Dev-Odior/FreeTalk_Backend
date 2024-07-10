import serverConfig from '@src/configs/server.config';
import imageService from '@src/services/image.service';
import { NextFunction, Request, Response } from 'express';

class ImageController {
  public async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramsIds: { imageId },
      } = req;

      await imageService.delete(imageId);

      return res.status(200).json({
        message: 'Image Deleted successfully',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error occurred at image controller delete method`);
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramsIds: { imageId },
        body,
      } = req;

      const data = await imageService.update(imageId, body);

      return res.status(200).json({
        message: 'Image updated successfully',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error occurred at image controller update method:${error}`);
      next(error);
    }
  }
}

export default ImageController;
