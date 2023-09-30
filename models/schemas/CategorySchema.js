const { DataTypes } = require('sequelize');

const sequelize = require('../../config/dbConfig');

const Category = sequelize.define('category',
  {
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'You must provide category name.' },
        notEmpty: { msg: 'Category name can not be empty.' },
      },
    },
  },
  {
    timestamps: false,
    tableName: 'categories'
  }
);

module.exports = Category;
