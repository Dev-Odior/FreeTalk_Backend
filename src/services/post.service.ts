import Post from '@src/models/post.model';
import BaseService from '.';
import Image from '@src/models/image.model';
import imageService from './image.service';
import NotFoundError from '@src/errors/notFound.error';

import { QueryOpts } from '@src/interface/functions.interface';
import userService from './user.service';

class PostService extends BaseService {
  constructor(private PostModel: typeof Post) {
    super();
  }

  private includables = this.generateIncludables(Image, 'images', ['name', 'url']);

  public async index(id: number, data: Partial<QueryOpts>) {
    const { offset, limit } = data;

    await userService.getById(id, true);

    const { rows: posts, count: totalPost } = await this.PostModel.findAndCountAll({
      where: {
        userProfileId: id,
      },
      limit,
      offset,
      include: this.includables,
    });
    return { posts, totalPost };
  }

  public async create(data: Partial<Post>): Promise<Post> {
    const { title, body, userProfileId, images } = data;
    const post = await this.PostModel.create({ title, body, userProfileId });

    await imageService.bulkCreate(post.id, images);
    await post.save();

    return post.reload({ include: this.includables });
  }

  public async getByPk(id: number, withError: boolean = false): Promise<Post> {
    const post = await this.PostModel.findByPk(id);

    if (!post && withError) {
      throw new NotFoundError('Post not found!');
    }

    return post.reload({ include: this.includables });
  }

  public async get(id: number, postId: number, withError: boolean = false): Promise<Post> {
    const post = await this.PostModel.findOne({
      where: {
        userProfileId: id,
        id: postId,
      },
    });

    if (!post && withError) {
      throw new NotFoundError('Post not found');
    }

    return post;
  }

  public async updatePost(userId: number, postId: number, data: Partial<Post>) {
    const { title, body } = data;

    const post = await this.get(postId, userId, true);

    const updatedPost = await post.update({
      title: title ?? post.title,
      body: body ?? post.body,
    });

    return updatedPost.reload({ include: this.includables });
  }

  public async delete(id: number) {
    const post = await this.getByPk(id, true);
    await post.destroy();
  }
}

export default new PostService(Post);
