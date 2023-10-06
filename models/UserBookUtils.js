const UserBook = require("./schemas/UserBookSchema");

const Book = require("../models/BookUtils");
const handlePagination = require("../utils/handlePagination");
UserBook.checkIfUserHasBook = async function (bookId, userId) {
  return await UserBook.count({ where: { bookId, userId } });
};

UserBook.addOrderBooks = async function (booksArray, t) {
  return await UserBook.bulkCreate(booksArray, {
    returning: true,
    transaction: t,
  });
};

UserBook.getAllPurchasedBooks = async function (userId, limit, page) {
  return await UserBook.findAndCountAll({
    where: { userId },
    include:[{model:Book}],
    ...handlePagination(limit, page),
  });
};

UserBook.userPurchasedBook = async function (userId, bookId){
  return UserBook.count({where: {userId, bookId}})
}
module.exports = UserBook;
