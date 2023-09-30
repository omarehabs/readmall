const { DataTypes } = require('sequelize');

const sequelize = require('../../config/dbConfig');
const Publisher = sequelize.define('publisher',
  {

    publisherName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Publisher name can not be null.',
        },
        notEmpty: {
          msg: 'Publisher name can not be empty.',
        },
        max: {
          msg: 'Name can not be more than 150 characters.',
          args: [3, 150],
        },
      },
    },

    license: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },

  {
    timestamps: false,
    tableName: 'publishers'
  }
);

module.exports = Publisher;
