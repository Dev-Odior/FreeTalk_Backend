import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { UserAttributeI } from '@src/interface/user.interface';
import bcrypt from 'bcryptjs';
import UserProfile from './userProfile.models';
import authConfig from '@src/configs/auth.config';
import serverConfig from '@src/configs/server.config';

export default class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements UserAttributeI
{
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;

  declare readonly profile?: UserProfile;
  declare readonly createdAt?: CreationOptional<Date>;
}

export const init = (connection: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      sequelize: connection,
      tableName: 'users',
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: {
          attributes: {
            include: ['password'],
          },
        },
      },
      hooks: {
        beforeCreate: (user) => {
          if (user.password) {
            const salt = bcrypt.genSaltSync(authConfig.SALT_ROUND);
            const encrypt = bcrypt.hashSync(user.password, salt);
            user.password = encrypt;
          }
        },
        beforeUpdate: (user) => {
          const changed = user.changed();
          serverConfig.DEBUG(changed, 'this is the changed');
          if (changed && changed.includes('password')) {
            const salt = bcrypt.genSaltSync(authConfig.SALT_ROUND);
            const encrypt = bcrypt.hashSync(user.password, salt);
            user.password = encrypt;
          }
        },
      },
    },
  );
};

export const association = () => {
  User.hasOne(UserProfile, {
    foreignKey: {
      allowNull: false,
      name: 'userId',
      field: 'userId',
    },
    as: 'profile',
  });
};
