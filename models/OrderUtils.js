const Order = require("./schemas/OrderSchema");
const OrderBook = require("./schemas/OrderBookSchema");
const Book = require("./schemas/BookSchema");
const handlePagination = require("../utils/handlePagination");

Order.createOrder = async function (books, userId, t) {
  const totalAmountInCents = books.reduce(
    (book1, book2) => book1 + book2.price,
    0
  );
  const totalQuantity = books.length;

  const order = await Order.create(
    { totalAmountInCents, totalQuantity, userId },
    { transaction: t }
  );
  books = books.map((b) => {
    return { bookId: b.id, orderId: order.id, amountInCents: b.price };
  });
  const orderBooks = await OrderBook.bulkCreate(books, {
    returning: true,
    transaction: t,
  });
  return order;
};

Order.findOrderById = async function (id) {
  return await Order.findByPk(id);
};

Order.proceedOrder = async function (id, orderData, t) {
  return await Order.update(orderData, {
    where: { id },
    transaction: t,
    returning: true,
  });
};

Order.getAllUserOrders = async function (userId, limit, page) {
  return await Order.findAndCountAll({
    where: { userId, success: true },
    include: [{ model: OrderBook, include: [{ model: Book }] }],
    ...handlePagination(limit, page),
  });
};

module.exports = Order;
