const Book = require("./schemas/BookSchema");
const Cart = require("./schemas/CartSchema");
const Review = require("./schemas/ReviewSchema");
const handlePaginaton = require("../utils/handlePagination");
Cart.addBookToCart = async function (cartObj) {
  return Cart.create(cartObj);
};

Cart.deleteBookFromCart = async function (cartObj) {
  return Cart.destroy({ where: cartObj });
};

Cart.getAllCartBooks = async function (userId, limit, page) {
  const whereObj = { userId }

  const books = await Cart.findAll({
    where: whereObj,
    include: [{ model: Book }],
    ...handlePaginaton(limit, page),
  });
  const booksCount = await Cart.count({ Where: whereObj })
  
  const rates = await Review.getBooksTotalRate(books.map((book) => {
    const bk = book.toJSON()
    return bk.book.id
  }))
  const mappedBooksWithRate = books.map((book) => {
    const bk = book.toJSON()
    let rate = rates.find((bookRate) => bookRate.dataValues.bookId === bk.book.id)
    return { ...bk, totalReviewsRate: +rate?.dataValues.avgRating ?? 0 }
  })


  return { count: booksCount, rows: mappedBooksWithRate };
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


Cart.userAddedBookToCart = async function (userId, bookId) {
  return Cart.count({ where: { userId, bookId } })
}

module.exports = Cart;
