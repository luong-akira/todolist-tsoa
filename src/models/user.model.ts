import { getFullUrl, ROOT_DIR } from '@commons/constant';
import { createJWToken } from '@config/auth';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

module.exports = function (sequelize, DataTypes) {
  const User: any = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      avatar: {
        type: DataTypes.STRING,
      },

      avatarFullUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          const avatar = this.getDataValue('avatar');
          if (avatar) {
            return getFullUrl(avatar);
          }
        },
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM,
        values: ['admin', 'user'],
        defaultValue: 'user',
      },
    },
    {
      underscored: true,
    },
  );

  User.associate = (db) => {
    db.User.hasMany(db.Todo);
    db.User.hasMany(db.ImportExport);
  };

  User.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });

  User.afterUpdate((user, options) => {
    if (user.changed('avatar')) {
      if (user._previousDataValues.avatar) {
        fs.unlinkSync(path.join(ROOT_DIR, user._previousDataValues.avatar));
      }
    }
  });

  User.prototype.generateToken = function generateToken() {
    return createJWToken({
      id: this.id,
      role: this.role,
    });
  };

  User.prototype.authenticate = function authenticate(value) {
    if (bcrypt.compareSync(value, this.password)) return true;
    else return false;
  };

  User.generatePassword = function (password) {
    console.log(password);
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  };

  return User;
};
