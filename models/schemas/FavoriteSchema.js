const sequelize = require("../../config/dbConfig");
const Book = require("./BookSchema");
const User = require("./UserSchema");

const Favorite = sequelize.define(
  "favorite",
  {},
  {
    tableName: "favorites",
    timestamps: false,
  }
);

Book.belongsToMany(User, {
  through: Favorite,
  as: "userBookFavorite",
  foreignKey: {
    allowNull: false,
    name: "bookId",
  },
});

User.belongsToMany(Book, {
  as: "BookFavorite",
  through: Favorite,
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

User.hasMany(Favorite, {
  foreignKey: {
    allowNull: false,
  },
});
Favorite.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});

Book.hasMany(Favorite, {
  foreignKey: {
    allowNull: false,
  },
});
Favorite.belongsTo(Book, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = Favorite;
