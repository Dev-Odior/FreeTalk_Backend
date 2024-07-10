import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

import { ImageAttributeI } from '@src/interface/image.interface';
import Post from './post.model';

export default class Image
  extends Model<InferAttributes<Image>, InferCreationAttributes<Image>>
  implements ImageAttributeI
{
  declare id: CreationOptional<number>;
  declare url: string;
  declare name: string;
  declare postId: number;

  declare createdAt?: CreationOptional<Date>;
}

export const init = (connection: Sequelize) => {
  Image.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize: connection, tableName: 'images', timestamps: true },
  );
};

export const association = () => {
  Image.belongsTo(Post, {
    as: 'post',
    foreignKey: 'postId',
  });
};
