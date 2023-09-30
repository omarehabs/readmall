const Book = require("./schemas/BookSchema");
const Cart = require("./schemas/CartSchema");
const handlePaginaton = require("../utils/handlePagination");
Cart.addBookToCart = async function (cartObj) {
  console.log(cartObj);
  return Cart.create(cartObj);
};

Cart.deleteBookFromCart = async function (cartObj) {
  return Cart.destroy({ where: cartObj });
};

Cart.getAllCartBooks = async function (userId, limit, page) {
  return await Cart.findAndCountAll({
    where: { userId },
    attributes: [],
    include: [{ model: Book }],
    ...handlePaginaton(limit, page),
  });
};

Cart.getAllCartBooksToCheckout = async function (userId) {
  const books = await Cart.findAll({
    where: { userId },
    attributes: [],
    include: [{ model: Book, attributes: ["id", "price", "title", "desc"] }],
  });
  if (books.length > 0) {
    return books.map((book) => {
      return book.toJSON()["book"];
    });
  }
  return [];
};

Cart.emptyCart = async function (userId, t) {
  return await Cart.destroy({ where: { userId }, transaction: t });
};

module.exports = Cart;
