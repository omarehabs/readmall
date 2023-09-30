const { DataTypes } = require("sequelize");

const sequelize = require("../../config/dbConfig");
const Book = require("./BookSchema");
const Order = require("./OrderSchema");
const User = require("./UserSchema");

const UserBook = sequelize.define(
  "user_book",
  {
  },
  {
    updatedAt: false,
    createdAt: true,
    tableName: "user_books",
  }
);

User.belongsToMany(Book, { through: UserBook , as: 'userBook'});
Book.belongsToMany(User, { through: UserBook , as: 'bookUser'});

UserBook.belongsTo(User, {
foreignKey: {
  allowNull: false,
},
});
User.hasMany(UserBook, {
  foreignKey: {
    allowNull: false,
  },
});
UserBook.belongsTo(Order, {
foreignKey: {
  allowNull: false,
},
});
Order.hasMany(UserBook, {
  foreignKey: {
    allowNull: false,
  },
});

Book.hasMany(UserBook, {
  foreignKey: {
    allowNull: false,
  },
});
UserBook.belongsTo(Book, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = UserBook;
