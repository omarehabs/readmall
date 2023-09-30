const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const sequelize = require("../../config/dbConfig");
const Country = require("./CountrySchema");

const { DEFAULT_AVATAR } = process.env;
const User = sequelize.define(
  "user",
  {
    // username: {
    //   type: DataTypes.STRING(30),
    //   allowNull: false,
    //   unique: true,
    //   validate: {
    //     notNull: {
    //       msg: 'You must provide a username',
    //     },
    //     notEmpty: {
    //       msg: 'Username can not be empty.',
    //     },
    //   },
    // },

    fullname: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notNull: {
          msg: "You must provide a your name.",
        },
        notEmpty: {
          msg: "First name can not be empty.",
        },
      },
    },

    // address: {
    //   type: DataTypes.STRING(250),
    //   allowNull: true,
    //   defaultValue: null,
    //   validate: {
    //     checkLen(val) {
    //       if (val && (val.length > 250 || val.length < 4)) {
    //         throw new Error("Address must be between 4 and 500 characters.");
    //       }
    //     },
    //   },
    // },

    phoneNum: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        checkLen(val) {
          if (val && !validator.isMobilePhone(val)) {
            throw new Error("A valid Phone Number must provided.");
          }
        },
      },
    },

    gender: {
      type: DataTypes.ENUM,
      allowNull: true,
      values: ["male", "female"],
      defaultValue: null,
    },

    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DEFAULT_AVATAR,
      isUrl: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

      validate: {
        notNull: {
          msg: "You must provide an email.",
        },
        notEmpty: {
          msg: "Email can not be empty.",
        },
        isEmail: {
          msg: "Please Enter a valid email.",
        },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notNull: {
          msg: "You must provide a password.",
        },
        notEmpty: {
          msg: "Password can not be empty.",
        },
        len: {
          args: [8, 72],
          msg: "Password must be greater than 8 characters.",
        },
        notContains: {
          args: ["password"],
          msg: "Password can not contain word password.",
        },
      },
    },

    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: "basic",
      values: ["basic", "admin"],
      validate: {
        notNull: {
          msg: "Role can not be null.",
        },
      },
    },

    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    hooks: {
      afterValidate: async (user, _) => {
        if (user.password) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      },
      beforeSave: (user, _) => {
        user.role = user.dataValues.role.toLowerCase();
        user.email = user.dataValues.email.toLowerCase();
        user.gender
          ? (user.gender = user.dataValues.gender.toLowerCase())
          : null;
        user.address
          ? (user.address = user.dataValues.address.toLowerCase())
          : null;
      },
      afterSave: (user, _) => {
        // for returning user after signup
        delete user.dataValues.createdAt;
        delete user.dataValues.updatedAt;
        delete user.dataValues.password;
      },
      afterFind: (user, _) => {
        if (user) {
          delete user.dataValues.createdAt;
          delete user.dataValues.updatedAt;
          // delete user.dataValues.password;
        }
      },
      afterUpdate: (user, _) => {
        // for returning user after signup
        user = user.toJSON();
        delete user.dataValues.createdAt;
        delete user.dataValues.updatedAt;
        delete user.dataValues.password;
      },
    },
  }
);

module.exports = User;
