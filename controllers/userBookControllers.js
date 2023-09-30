const UserBook = require("../models/UserBookUtils");
const { errorHandler } = require("../utils/errorHandler");
const successHandler = require("../utils/successHandler");
const handleNumOfPages = require("../utils/handleNumOfPages");
async function getAllPurchasedBooksCtrl(req, res) {
  const userId = req.userId;
  const { limit, page } = req.query;
  try {
    const { rows: purchasedBooks, count } = await UserBook.getAllPurchasedBooks(
      userId,
      limit,
      page
    );

    return successHandler(
      res,
      200,
      `found ${purchasedBooks.length} books user with id ${userId} purchased`,
      {
        numOfPages: purchasedBooks.length
          ? handleNumOfPages(count, limit, 10)
          : 0,
        books: purchasedBooks.length ? purchasedBooks : [],
      }
    );
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

module.exports = { getAllPurchasedBooksCtrl };
