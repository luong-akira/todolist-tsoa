import { createJWToken } from '@config/auth';
import * as bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

module.exports = function (sequelize, DataTypes) {
  const User: any = sequelize.define('User', {
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
  });

  User.associate = (db) => {
    db.User.hasMany(db.Todo);
  };

  User.beforeSave((user, options) => {
    //console.log('before SAVE:   ', { user });
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
      //console.log('before SAVE:11111   ', { user });
    }
  });

  User.prototype.generateToken = function generateToken() {
    return createJWToken({
      //phone: this.phone,
      id: this.id,
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
