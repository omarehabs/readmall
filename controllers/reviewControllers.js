const Review = require("../models/ReviewUtils");
const { errorHandler } = require("../utils/errorHandler");
const successHandler = require("../utils/successHandler");
const {
  createReviewSchema,
  updateReviewSchema,
} = require("../utils/schemaValidator/reviewSchemaValidator");
const handleNumOfPages = require("../utils/handleNumOfPages");

async function addReviewCtrl(req, res) {
  const userId = req.userId;
  req.body.userId = userId;
  const { value, error } = createReviewSchema.validate(req.body);
  if (error) {
    return errorHandler(res, 400, { message: error });
  }
  try {
    const review = await Review.addReview(value);

    if (review) {
      return successHandler(res, 201, "new review added", { review });
    }
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function updateReviewCtrl(req, res) {
  const reviewId = req.params.reviewId;
  const userId = req.userId;
  if (!reviewId) {
    return errorHandler(res, 400, { message: "reviewId is required" });
  }

  const { value, error } = updateReviewSchema.validate(req.body);
  if (error) {
    return errorHandler(res, 400, error);
  }

  try {
    const [numOfReviewsUpdated] = await Review.updateReview(
      reviewId,
      userId,
      value
    );

    if (numOfReviewsUpdated) {
      return successHandler(res, 200, "updated review successfully", {
        numOfReviewsUpdated,
      });
    }
    return errorHandler(res, 404, {
      message: "there is no review with such id for this user",
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function deleteReviewCtrl(req, res) {
  const reviewId = req.params.reviewId;
  const userId = req.userId;
  if (!reviewId) {
    return errorHandler(res, 400, { message: "reviewId is required." });
  }

  try {
    const review = await Review.deleteReview(reviewId, userId);
    if (review) {
      return successHandler(res, 200, `${review} reviews deleted.`, {
        reviewsDeleted: review,
      });
    }

    return errorHandler(res, 404, {
      message: "there is no review with such id for this user",
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getReviewByIdCtrl(req, res) {
  const reviewId = req.params.reviewId;
  if (!reviewId) {
    return errorHandler(res, 400, { message: "reviewId is required." });
  }

  try {
    const review = await Review.getReviewById(reviewId);
    if (review) {
      return successHandler(res, 200, `found review successfully`, { review });
    }

    return errorHandler(res, 400, { message: "no review with such ID" });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getAllBookReviewsCtrl(req, res) {
  const { limit, page } = req.query;
  const bookId = req.params.bookId;
  if (!bookId) {
    return errorHandler(res, 404, { message: "bookId is required" });
  }

  try {
    const { rows: reviews, count } = await Review.getAllBookReviews(
      bookId,
      limit,
      page
    );

    if (reviews.length === 0) {
      return successHandler(res, 200, "no reviews found for such book ID", {
        numOfPages: 0,
        reviews: [],
      });
    }
    return successHandler(res, 200, `found ${reviews.length} for this book`, {
      numOfPages: handleNumOfPages(count, limit, 10),
      reviews,
    });
  } catch (e) {
    return errorHandler(res, 404, e);
  }
}

module.exports = {
  addReviewCtrl,
  updateReviewCtrl,
  deleteReviewCtrl,
  getReviewByIdCtrl,
  getAllBookReviewsCtrl,
};
