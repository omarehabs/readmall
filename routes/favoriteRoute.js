const express = require("express");

const {
  addFavoriteBookCtrl,
  deleteFavoriteBookCtrl,
  getAllFavoriteBooks,
} = require("../controllers/favoritesControllers");

const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const favoriteRouter = express.Router();

favoriteRouter.post(
  `/addFavorite`,
  isLoggedInAndVerified,
  addFavoriteBookCtrl
);
favoriteRouter.delete(
  `/deleteFavorite/:bookId`,
  isLoggedInAndVerified,
  deleteFavoriteBookCtrl
);
favoriteRouter.get(
  `/allFavorites`,
  isLoggedInAndVerified,
  getAllFavoriteBooks
);

module.exports = favoriteRouter;
