const Cart = require("../models/CartUtils");
const UserBook = require("../models/UserBookUtils");
const Book = require("../models/BookUtils");
const { errorHandler, serverError } = require("../utils/errorHandler");
const basicSuccessHandler = require("../utils/successHandler");

async function addBookToCartCtrl(req, res) {
  const userId = req.userId;
  const bookId = req.body.bookId;
  try {
    const isPurchaseable = await Book.isBookPurchaseable(bookId, userId);
    if (!isPurchaseable) {
      return errorHandler(res, 400, {
        message: "you can not add to cart a book that is not for selling",
      });
    }
    const userHasBook = await UserBook.checkIfUserHasBook(bookId, userId);
    if (userHasBook) {
      return errorHandler(res, 400, {
        message: "you can not add to cart a book you have already bought",
      });
    }
    const addCartBook = await Cart.addBookToCart({
      userId,
      bookId,
    });
    if (addCartBook) {
      return basicSuccessHandler(
        res,
        200,
        `added Book with id ${bookId} to cart`
      );
    }

    return serverError(res);
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function deleteBookFromCartCtrl(req, res) {
  const userId = req.userId;
  const bookId = req.params.bookId;
  try {
    const deleteCartBook = await Cart.deleteBookFromCart({
      userId,
      bookId,
    });
    if (deleteCartBook) {
      return basicSuccessHandler(
        res,
        200,
        `deleted Book with id ${bookId} from cart`
      );
    }

    return errorHandler(res, 400, {
      message: "no Book in the cart to delete for such user ID",
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getAllCartBooks(req, res) {
  const userId = req.userId;
  const { limit, page } = req.query;

  try {
    const { rows: allCartBooks, count } = await Cart.getAllCartBooks(
      userId,
      limit,
      page
    );
    if (allCartBooks) {
      return basicSuccessHandler(
        res,
        200,
        `got all cart Books for user with id ${userId}`,
        { books: allCartBooks, numOfPages: count }
      );
    }

    return serverError(res);
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

module.exports = {
  addBookToCartCtrl,
  deleteBookFromCartCtrl,
  getAllCartBooks,
};
