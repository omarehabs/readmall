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

// const { multerConfig } = require("../helpers/multerUpload");
const { multipleFields } = require("../helpers/multerUpload");
const BookRouter = express.Router();

const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const ifLogged = require("../middleware/ifLogged");
const isAdmin = require("../middleware/isAdmin");

BookRouter.get(`/getById/:id`, ifLogged, getBookByIdCtrl);
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
  multipleFields('/public/books', [
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ], 12),
  addBookCtrl
);
BookRouter.patch(
  `/updateBook/:bookId`,
  isLoggedInAndVerified,
  isAdmin,
  updateBookCtrl
);

module.exports = BookRouter;
