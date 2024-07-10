import serverConfig from '@src/configs/server.config';
import { Request, Response, NextFunction } from 'express';
import postService from '@src/services/post.service';


class PostController {
  public async index(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        queryOpts: { offset, limit },
        user: { id },
      } = req;
      const data = await postService.index(id, { offset, limit });
      return res.status(200).json({
        message: 'post retrieved successfully',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in the post controller index method:${error}`);
      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramsIds: { postId },
      } = req;
      const data = await postService.getByPk(postId, true);

      return res.status(200).json({
        message: 'Post retrieved successfully',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error occurred at the post controller get method:${error}`);
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        body: { body, title, images },
        user: {
          profile: { id },
        },
      } = req;

      const post = await postService.create({ body, title, userProfileId: id, images });

      return res.status(200).json({
        message: 'Post created successfully',
        data: post,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error occurred at the post controller at create method:${error}`);
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        paramsIds: { postId },
      } = req;

      await postService.delete(postId);

      return res.status(200).json({
        message: 'User delete successfully',
      });
    } catch (error) {
      serverConfig.DEBUG(`Error occurred at post controller delete method:${error}`);
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const {
        user: { id },
        paramsIds: { postId },
        body,
      } = req;

      const data = await postService.updatePost(id, postId, body);

      return res.status(200).json({
        message: 'Post updated successfully',
        data,
      });
    } catch (error) {
      serverConfig.DEBUG(`Error in the post controller update method:${error}`);
      next(error);
    }
  }
}

export default PostController;
