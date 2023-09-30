const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig");

const User = require("./UserSchema");

const Order = sequelize.define(
  "order",
  {
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          msg: "Order totalQuantity can not be less than one.",
          args: [1],
        },
        notNull: {
          msg: "Order totalQuantity can not be null.",
        },
      },
    },

    totalAmountInCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Order totalAmountInCents can not be less than 0 and only number.",
        },
        notNull: {
          msg: "Order totalAmountInCents can not be null.",
        },
      },
    },

    pending: {
      type: DataTypes.BOOLEAN,
      validate: {
        checkEmpty(val ) {
          if (val === null || val === undefined) {
            throw new Error("Order pending field can not be empty");
          }
        },
      },
    },

    success: {
      type: DataTypes.BOOLEAN,
      validate: {
        checkEmpty(val) {
          if (val === null || val === undefined) {
            throw new Error("Order success field can not be empty");
          }
        },
      },
    },

    currency: {
      type: DataTypes.ENUM,
      values: ["EGP", "USD"],
      defaultValue: "EGP",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Order success field can not be empty",
        },
        notNull: {
          msg: "Order success field can not be null.",
        },
      },
    },
    
    transactionOrderId: {
      type: DataTypes.INTEGER,
      validate: {
        checkEmpty(val) {
          if (val === null || val === undefined) {
            throw new Error("Order transactionOrderId field can not be empty");
          }
        },
      },
    },

    transactionId: {
      type: DataTypes.INTEGER,
      validate: {
        checkEmpty(val ) {
          if (val === null || val === undefined) {
            throw new Error("Order transactionId field can not be empty");
          }
        },
      },
    },
    orderCreatedAt: {
      type: DataTypes.DATE,
      validate: {
        checkEmpty(val) {
          if (val === null || val === undefined) {
            throw new Error("orderCreatedAt field can not be empty");
          }
        },
      },
    },
  },
  {
    createdAt: true,
    updatedAt: false,
    tableName: "orders",
  }
);

User.hasMany(Order, {
  foreignKey: {
    allowNull: false,
  },
});
Order.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = Order;
