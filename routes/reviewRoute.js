const express = require("express");

const {
  addReviewCtrl,
  updateReviewCtrl,
  deleteReviewCtrl,
  getReviewByIdCtrl,
  getAllBookReviewsCtrl,
} = require("../controllers/reviewControllers");

const reviewRoute = express.Router();

const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const isAdmin = require("../middleware/isAdmin");

reviewRoute.post(`/addReview`, isLoggedInAndVerified, addReviewCtrl);
reviewRoute.get(`/getReviewById/:reviewId`, getReviewByIdCtrl);
reviewRoute.get(`/getBookReviews/:bookId`, getAllBookReviewsCtrl);
reviewRoute.patch(
  `/updateReview/:reviewId`,
  isLoggedInAndVerified,
  updateReviewCtrl
);
reviewRoute.delete(
  `/deleteReview/:reviewId`,
  isLoggedInAndVerified,
  deleteReviewCtrl
);

module.exports = reviewRoute;
