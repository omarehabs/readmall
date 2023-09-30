const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig');
const Country = sequelize.define('country',
  {
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Country can not be null.',
        },
        notEmpty: {
          msg: 'Country name can not be empty.',
        },
        len: {
          msg: 'Country name must be between 2 and 30 characters.',
          args: [2, 30],
        },
      },
    },
  },
  {
    tableName: 'countries'
  }
);

module.exports = Country;
