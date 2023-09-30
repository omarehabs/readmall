const { DataTypes } = require('sequelize');

const sequelize = require('../../config/dbConfig');
const Country = require('./CountrySchema');

const { DEFAULT_AVATAR } = process.env;

const Author = sequelize.define('author',
  {
    authorAvatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: DEFAULT_AVATAR,
    },

    authorName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Author name can not be empty.',
        },
        notNull: {
          msg: 'Author name can not be null.',
        },
        max: {
          msg: 'Name can not be more than 150 characters.',
          args: [150],
        },
      },
    },

    bio: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: null,
      validate: {
        checkLen(val) {
          if (val && (val.length > 250 || val.length < 4)) {
            throw new Error(
              'Biography can not be more than 200 characters or less than 4'
            );
          }
        },
      },
    },

    birthDate: {
      type: DataTypes.DATE(14),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Birth Date can not be null.',
        },
      },
    },

    deathDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

  },
  {
    hooks: {
      afterFind: (author, op) => {
        // if (author) {
        //   // author = author.toJSON();
        // }
      }
    },
    timestamps: false,
    tableName: 'authors'
  }
);

module.exports = Author;
