import { CommentAttributeI } from '@src/interface/comment.interface';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

import Reply from './reply.model';
import Post from './post.model';

export default class Comment
  extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>>
  implements CommentAttributeI
{
  declare id: CreationOptional<number>;
  declare text: string;
  declare postId: number;

  declare readonly replies?: Reply[];
  declare readonly createdAt?: CreationOptional<Date>;
}

export const init = (connection: Sequelize) => {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize: connection, tableName: 'comments', timestamps: true, paranoid: true },
  );
};

export const association = () => {
  Comment.belongsTo(Post, {
    foreignKey: 'postId',
  });

  Comment.hasMany(Reply, {
    foreignKey: 'commentId',
  });
};
