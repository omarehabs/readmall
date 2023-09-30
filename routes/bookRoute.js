const express = require("express");

const {
  addBookCtrl,
  getBookByIdCtrl,
  getCategoryBooksCtrl,
  getMostViewedBooksCtrl,
  getBooksByAuthorIdCtrl,
  getBooksByPublisherIdCtrl,
  getRecentlyUploadedBooks,
  searchBooksCtrl,
  filterBooksCtrl,
  updateBookCtrl,
} = require("../controllers/bookControllers");

const { multerConfig } = require("../helpers/multerUpload");
const { errorCtrl } = require("../middleware/multerErrorController");
const BookRouter = express.Router();

const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const isLoggedIn = require("../middleware/isLoggedIn");
const isMe = require("../middleware/isMe");
const isAdmin = require("../middleware/isAdmin");

BookRouter.get(`/getById/:id`, getBookByIdCtrl);
BookRouter.get(`/getByCategoryId/:categoryId`, getCategoryBooksCtrl);
BookRouter.get(`/getByViews`, getMostViewedBooksCtrl);
BookRouter.get(`/getByPublisherId/:publisherId`, getBooksByPublisherIdCtrl);
BookRouter.get(`/getByAuthorId/:authorId`, getBooksByAuthorIdCtrl);
BookRouter.get(`/searchBooks`, searchBooksCtrl);
BookRouter.get(`/filterBooks`, filterBooksCtrl);
BookRouter.get(`/getRecentlyUploaded`, getRecentlyUploadedBooks);
BookRouter.post(
  `/uploadPdf`,
  isLoggedInAndVerified,
  multerConfig().fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  addBookCtrl
);
BookRouter.patch(
  `/updateBook/:bookId`,
  isLoggedInAndVerified,
  isAdmin,
  updateBookCtrl
);

module.exports = BookRouter;
