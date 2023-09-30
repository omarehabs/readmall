const express = require("express");

const {
  addBookToCartCtrl,
  deleteBookFromCartCtrl,
  getAllCartBooks,
} = require("../controllers/cartControllers");

const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const cartRouter = express.Router();

cartRouter.post(`/addToCart`, isLoggedInAndVerified, addBookToCartCtrl);
cartRouter.delete(
  `/deleteFromCart/:bookId`,
  isLoggedInAndVerified,
  deleteBookFromCartCtrl
);
cartRouter.get(`/allCartBooks`, isLoggedInAndVerified, getAllCartBooks);

module.exports = cartRouter;
