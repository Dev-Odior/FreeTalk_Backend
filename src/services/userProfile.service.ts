import UserProfile from '@src/models/userProfile.models';
import BaseService from '.';
import NotFoundError from '@src/errors/notFound.error';

class UserProfileService extends BaseService {
  constructor(private userProfileModel: typeof UserProfile) {
    super();
  }

  public async create(data: Partial<UserProfile>): Promise<UserProfile> {
    const { fullName, email, userId } = data;
    const userProfile = await UserProfile.create({ fullName, email, userId });
    await userProfile.save();

    return userProfile;
  }

  public async delete(id: number): Promise<void> {
    const profile = await this.getById(id, true);
    await profile.destroy();
  }

  public async getById(id: number, withError: boolean = false): Promise<UserProfile> {
    const profile = await this.userProfileModel.findOne({
      where: {
        id: id,
      },
    });

    if (!profile && withError) {
      throw new NotFoundError('User profile not found');
    }

    return profile;
  }

  public async getByParentId(id: number, withError: boolean = false): Promise<UserProfile> {
    const profile = await this.userProfileModel.findOne({
      where: {
        userId: id,
      },
    });

    if (!profile && withError) {
      throw new NotFoundError(`No user with parent id`);
    }

    return profile;
  }
}

export default new UserProfileService(UserProfile);
