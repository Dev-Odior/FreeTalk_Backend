import User from '@src/models/user.model';
import userService from './user.service';
import userProfileService from './userProfile.service';
import jwt from 'jsonwebtoken';
import authConfig from '@src/configs/auth.config';
import BadRequestError from '@src/errors/badRequest.error';
import bcrypt from 'bcryptjs';

class AuthService {
  constructor(private userModel: typeof User) {}

  public async userExist(email: string) {
    const user = await userService.getByEmail(email);
    return user ? true : false;
  }

  public async signUp(data: Partial<User>) {
    const { firstName, lastName, email, password } = data;

    const userExist = await this.userExist(email);

    if (userExist) {
      throw new BadRequestError('User with this email already exist!!');
    }

    const user = await userService.create({ firstName, lastName, email, password });

    const profile = await userProfileService.create({
      fullName: `${firstName} ${lastName}`,
      email,
      userId: user.id,
    });

    if (!profile) {
      throw new BadRequestError('Something went wrong');
    }

    const reloadedUser = await userService.reload(user);
    const userWithoutPassword = userService.removeUserPassword(reloadedUser);

    const accessToken = this.generateAccessToken(userWithoutPassword);

    return { result: userWithoutPassword, token: accessToken };
  }

  public async login(data: Partial<User>) {
    const { email, password } = data;
    const user = await userService.getByEmail(email);

    if (!user || !this.comparePassword(password, user.password)) {
      throw new BadRequestError(`Email or Password is incorrect!!`);
    }

    const reloadedUser = await userService.reload(user);
    const removePassword = userService.removeUserPassword(reloadedUser);

    const token = this.generateAccessToken(removePassword);

    return { result: removePassword, token: token };
  }

  public async forgotPassword(email: string) {
    const user = await userService.getByEmail(email, true);
    const withoutPassword = userService.removeUserPassword(user);
    const token = this.generateAccessToken(withoutPassword);
    const url = this.generateEmailUrl(withoutPassword, token);
    return url;
  }

  public generateEmailUrl(user: Partial<User>, token: string): string {
    return `/auth/reset-password/?uid=${user.id}&token=${token}`;
  }

  public generateAccessToken(user: Partial<User>): string {
    const accessToken = jwt.sign({ ...user }, 'secret', { expiresIn: authConfig.TOKEN_EXPIRES });

    return accessToken;
  }

  public verifyAccessToken(token: string) {
    const payload = jwt.verify(token, 'secret');
    try {
      return {
        payload,
        expired: false,
      };
    } catch (error) {
      return {
        payload: null,
        expired: error.message.includes('expired') ? error.message : error,
      };
    }
  }

  public comparePassword(password: string, hashedPassword: string): boolean {
    const verify = bcrypt.compareSync(password, hashedPassword);
    return verify;
  }
}

export default new AuthService(User);
