import { PostAttributeI } from '@src/interface/post.interface';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

import Comment from './comment.model';
import UserProfile from './userProfile.models';
import Image from './image.model';

export default class Post
  extends Model<InferAttributes<Post>, InferCreationAttributes<Post>>
  implements PostAttributeI
{
  declare id: CreationOptional<number>;
  declare title: string;
  declare body: string;
  declare userProfileId: number;

  declare readonly images?: Image[];
  declare readonly createdAt?: CreationOptional<Date>;
}

export const init = (connection: Sequelize) => {
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      body: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      userProfileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize: connection, tableName: 'posts', timestamps: true },
  );
};

export const association = () => {
  Post.hasMany(Comment, {
    foreignKey: 'postId',
  });

  Post.hasMany(Image, {
    foreignKey: 'postId',
    as: 'images',
  });

  Post.belongsTo(UserProfile, {
    foreignKey: 'userProfileId',
    as: 'posts',
  });
};
