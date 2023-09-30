const Favorite = require("../models/FavoriteUtils");
const { errorHandler, serverError } = require("../utils/errorHandler");
const  basicSuccessHandler = require("../utils/successHandler");

async function addFavoriteBookCtrl(req, res) {
  const userId = req.userId;
  const bookId = req.body.bookId;
  try {
    const addFavoriteBook = await Favorite.addFavoriteBook({
      userId,
      bookId,
    });
    if (addFavoriteBook) {
      return basicSuccessHandler(
        res,
        200,
        `added book with id ${bookId} to favorites`
      );
    }

    return serverError(res);
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function deleteFavoriteBookCtrl(req, res) {
  const userId = req.userId;
  const bookId = req.params.bookId;
  try {
    const deleteFavoriteBook = await Favorite.deleteFavoriteBook({
      userId,
      bookId,
    });
    if (deleteFavoriteBook) {
      return basicSuccessHandler(
        res,
        200,
        `deleted book with id ${bookId} from favorites`
      );
    }

    return errorHandler(res, 404, {message: 'there is no book in favorites to delete for such user ID'});
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getAllFavoriteBooks(req, res) {
  const userId = req.userId;
  const { limit, page } = req.query;

  try {
    const { rows: allFavoriteBooks, count } =
      await Favorite.getAllFavoriteBooks(userId, limit, page);
    if (allFavoriteBooks) {
      return basicSuccessHandler(
        res,
        200,
        `got all books for user with id ${userId}`,
        { books: allFavoriteBooks, numOfPages: count }
      );
    }

    return serverError(res);
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

module.exports = {
  addFavoriteBookCtrl,
  deleteFavoriteBookCtrl,
  getAllFavoriteBooks,
};
