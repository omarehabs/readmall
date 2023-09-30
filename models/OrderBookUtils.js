const OrderBook = require("./schemas/OrderBookSchema");

// OrderBook.checkIfUserHasBook = async function (bookId, userId) {
//   return OrderBook.count({ where: { bookId, userId } });
// };
OrderBook.addOrderBooks = async function (booksArray, t) {
  return OrderBook.bulkCreate(booksArray, {
    returning: true,
    transaction: t,
  });
};

OrderBook.getAllOrderBooks = async function (orderId, userId) {
  const books = await OrderBook.findAll({ where: { orderId } });
  if (books.length) {
    return books.map((book) => {
      book = book.toJSON();
      return {
        bookId: book.bookId,
        userId,
        orderId,
      };
    });
  }
  return [];
};
module.exports = OrderBook;
