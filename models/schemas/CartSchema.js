const sequelize = require("../../config/dbConfig");
const Book =require("./BookSchema");
const User = require("./UserSchema");

const Cart = sequelize.define(
  "cart",
  {},
  {
    tableName: "carts",
    timestamps: false,
  }
);

Book.belongsToMany(User, {
  through: Cart,
  as: "userBookCart",
  foreignKey: {
    allowNull: false,
    name: "bookId",
  },
});

User.belongsToMany(Book, {
  as: "bookCart",
  through: Cart,
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

User.hasMany(Cart, {
  foreignKey: {
    allowNull: false,
  },
});
Cart.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});

Book.hasMany(Cart, {
  foreignKey: {
    allowNull: false,
  },
});
Cart.belongsTo(Book, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = Cart;
