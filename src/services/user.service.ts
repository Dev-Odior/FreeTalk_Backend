import BadRequestError from '@src/errors/badRequest.error';
import NotFoundError from '@src/errors/notFound.error';
import { ResetUserPassword } from '@src/interface/user.interface';
import User from '@src/models/user.model';
import jwt from 'jsonwebtoken';
import BaseService from '.';
import UserProfile from '@src/models/userProfile.models';
import Post from '@src/models/post.model';
import { QueryOpts } from '@src/interface/functions.interface';
import userProfileService from './userProfile.service';

class UserService extends BaseService {
  constructor(private userModel: typeof User) {
    super();
  }

  private includable = this.generateIncludables(
    UserProfile,
    'profile',
    ['fullName', 'id'],
    [this.generateIncludables(Post, 'posts', ['title', 'id'])],
  );

  public async index(data: QueryOpts) {
    const { limit, offset } = data;

    const { rows: users, count: totalCount } = await this.userModel.findAndCountAll({
      limit,
      offset,
      include: this.includable,
    });

    return { users, totalCount };
  }

  public async get(id: number, withError: boolean = false) {
    const user = await this.userModel.findOne({ where: { id }, include: this.includable });
    if (!user && withError) throw new NotFoundError('User Not found!');
    return user;
  }

  public async getById(id: number, withError: boolean = false) {
    const user = await this.userModel.scope('withPassword').findByPk(id);

    if (!user && withError) {
      throw new NotFoundError('User Not Found!!');
    }

    return user;
  }

  public async delete(id: number) {
    const user = await this.get(id, true);
    await userProfileService.delete(user.toJSON().profile.id);
    await user.destroy();
  }

  public async update(id: number, data: User): Promise<Partial<User>> {
    const { lastName, firstName, password, email } = data;
    const user = await this.getById(id, true);

    await user.update({
      lastName: lastName ?? user.lastName,
      firstName: firstName ?? user.firstName,
      password: password ?? user.password,
      email: email ?? user.email,
    });

    const profile = await userProfileService.getByParentId(user.id, true);

    await profile.update({
      fullName:
        lastName && firstName
          ? `${lastName} ${firstName}`
          : lastName || firstName
            ? `${lastName ?? user.lastName} ${firstName ?? user.firstName}`
            : profile.fullName,
      email: email ?? profile.email,
    });

    const reload = await user.reload({ include: this.includable });

    return this.removeUserPassword(reload);
  }

  public async getByEmail(email: string, withError: boolean = false) {
    const user = await this.userModel.scope('withPassword').findOne({
      where: {
        email: email,
      },
      include: this.includable,
    });

    if (!user && withError) {
      throw new NotFoundError('No user Found!!');
    }

    return user;
  }

  public async create(data: Partial<User>) {
    const { email, password, firstName, lastName } = data;

    const attribute = { email, password, firstName, lastName };

    const [user] = await this.userModel.findOrCreate({
      where: { email },
      defaults: attribute,
    });

    return user;
  }

  public async reload(data: Partial<User>) {
    const user = await data.reload({ include: this.includable });
    return user;
  }

  public async resetUserPassword(id: number, token: string, data: ResetUserPassword) {
    const { status, user } = await this.validateVerificationToken(id, token);

    const { password } = data;

    if (!status) {
      throw new BadRequestError('Email link is invalid');
    }

    await user.update({ password });
    const reloadUser = await user.reload();

    return this.removeUserPassword(reloadUser);
  }

  public async changeUserPassword(password: string, id: number) {
    const user = await this.getById(id);
    await user.update({ password });
    const reload = await user.reload();
    return this.removeUserPassword(reload);
  }

  public async validateVerificationToken(id: number, token: string) {
    const user = await this.getById(id);

    if (!user) throw new NotFoundError('User does not exist on the system!!');

    const verify = jwt.verify(token, 'secret');

    return verify ? { status: true, user } : { status: false, user };
  }

  public removeUserPassword(user: Partial<User>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...withoutPassword } = user.toJSON();
    return { ...withoutPassword };
  }
}

export default new UserService(User);
