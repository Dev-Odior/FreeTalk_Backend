import NotFoundError from '@src/errors/notFound.error';
import Image from '@src/models/image.model';

class ImageService {
  constructor(private ImageModel: typeof Image) {}

  public async getByPk(id: number, withError: boolean = false): Promise<Image> {
    const image = await this.ImageModel.findByPk(id);

    if (!image && withError) {
      throw new NotFoundError('No image found');
    }

    return image;
  }

  public async bulkCreate(id: number, data: Partial<Image>[]) {
    const images = data.map((img) => {
      return { postId: id, ...img };
    });
    const bulkImages = await this.ImageModel.bulkCreate(images);

    return bulkImages;
  }

  public async delete(id: number) {
    const image = await this.getByPk(id, true);
    await image.destroy();
  }

  public async update(id: number, data: Partial<Image>) {
    const { name, url } = data;

    const image = await this.getByPk(id, true);

    const updated = await image.update({
      name: name ?? image.name,
      url: url ?? image.url,
    });

    return updated.reload();
  }
}

export default new ImageService(Image);
