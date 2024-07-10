import { UserProfileAttributeI } from '@src/interface/userProfile.interface';

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import Post from './post.model';
import User from './user.model';

export default class UserProfile
  extends Model<InferAttributes<UserProfile>, InferCreationAttributes<UserProfile>>
  implements UserProfileAttributeI
{
  declare id: CreationOptional<number>;
  declare fullName: string;
  declare email: string;
  declare userId: number;

  declare readonly post?: Post[];
  declare readonly createdAt?: CreationOptional<Date>;
}

export const init = (connection: Sequelize) => {
  UserProfile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
    },
    { sequelize: connection, timestamps: true, tableName: 'user_profiles', paranoid: true },
  );
};

export const association = () => {
  UserProfile.hasMany(Post, {
    foreignKey: 'userProfileId',
    as: 'posts',
  });

  UserProfile.belongsTo(User, {
    foreignKey: {
      allowNull: false,
      name: 'userId',
      field: 'userId',
    },
    as: 'profile',
  });
};
