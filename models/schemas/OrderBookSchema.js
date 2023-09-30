const { DataTypes } = require("sequelize");

const sequelize = require("../../config/dbConfig");
const Book = require("./BookSchema");
const Order = require("./OrderSchema");

const OrderBook = sequelize.define(
  "order_book",
  {
    amountInCents: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: "Order book amount can not be less than 0.00.",
        },
        notNull: {
          msg: "Order book amount can not be null.",
        },
      },
    },
  },
  {
    updatedAt: false,
    createdAt: true,
    tableName: "order_books",
  }
);

Book.belongsToMany(Order, { through: OrderBook });
Order.belongsToMany(Book, { through: OrderBook });

OrderBook.belongsTo(Order, {
foreignKey: {
  allowNull: false,
},
});
Order.hasMany(OrderBook, {
  foreignKey: {
    allowNull: false,
  },
});

Book.hasMany(OrderBook, {
  foreignKey: {
    allowNull: false,
  },
});
OrderBook.belongsTo(Book, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = OrderBook;
