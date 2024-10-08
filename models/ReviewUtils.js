const { Op, Sequelize } = require("sequelize");
const Review = require("./schemas/ReviewSchema");
const User = require("./schemas/UserSchema");
const handlePagination = require("../utils/handlePagination");

Review.addReview = async function (review) {
  return await Review.create(review);
};

Review.deleteReview = async function (reviewId, userId) {
  const reviewDeleted = await Review.destroy({
    where: {
      id: reviewId,
      userId,
    },
  });

  return reviewDeleted;
};

Review.updateReview = async function (reviewId, userId, review) {
  const reviewUpdated = await Review.update(review, {
    where: {
      id: reviewId,
      userId,
    },
  });

  return reviewUpdated;
};

Review.getReviewById = async function (reviewId) {
  const review = await Review.findOne({
    where: {
      id: reviewId,
    },
  });

  return review;
};

Review.getAllBookReviews = async function (bookId, limit, page) {
  return await Review.findAndCountAll({
    where: {
      bookId,
    },
    attributes: ["rate", "comment", "createdAt", "id"],
    include: [
      {
        model: User,
        attributes: ["id", "fullname", "avatarUrl"],
      },
    ],
    order: [["updatedAt", "DESC"]],
    ...handlePagination(limit, page),
  });
};
Review.getReviewAuthor = async function (reviewId) {
  return await Review.findOne({
    include: [
      {
        model: User,
        attributes: ["id"],
      },
    ],
    attributes: ["user.id"],
  });
};

Review.userReviewedBook = async function (userId, bookId) {
  return Review.count({ where: { userId, bookId } })
}

Review.getBooksTotalRate = async function (booksIds) {
  console.log(booksIds, 'books Ids')
  const rates = await Review.findAll({
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('rate')), 'avgRating'],
      'bookId'
    ],
    where: {
      bookId: {
        [Op.in]: booksIds,  // Filters by the list of bookIds
      },
    },
    group: ['bookId']
  });

  return rates
}

module.exports = Review;
