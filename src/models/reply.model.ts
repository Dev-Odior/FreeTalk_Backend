import { ReplyAttributeI } from '@src/interface/reply.interface';

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import Comment from './comment.model';

export default class Reply
  extends Model<InferAttributes<Reply>, InferCreationAttributes<Reply>>
  implements ReplyAttributeI
{
  declare id: CreationOptional<number>;
  declare text: string;
  declare commentId: number;

  declare readonly createdAt?: CreationOptional<Date>;
}

export const init = (connection: Sequelize) => {
  Reply.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize: connection, timestamps: true, tableName: 'replies', paranoid: true },
  );
};

export const association = () => {
  Reply.belongsTo(Comment, {
    foreignKey: 'commentId',
  });
};
