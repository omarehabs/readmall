const express = require("express");

const {
  createAuthorCtrl,
  getAuthorByIdCtrl,
  findAuthorByNameCtrl,
  updateAuthorCtrl,
  deleteAuthorCtrl,
  getAllAuthorsCtrl
} = require("../controllers/authorControllers");

const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const isAdmin = require("../middleware/isAdmin");
const { singleImage } = require("../helpers/multerUpload");

const authorRoute = express.Router();

authorRoute.post(
  `/makeAuthor`,
  isLoggedInAndVerified,
  isAdmin,
  createAuthorCtrl
);
authorRoute.get(`/getAuthorById/:authorId`, getAuthorByIdCtrl);
authorRoute.get(`/getAuthorByName`, findAuthorByNameCtrl);
authorRoute.patch(
  `/updateAuthor/:authorId`,
  isLoggedInAndVerified,
  isAdmin,
  singleImage('/public/images','avatar', 5),
  updateAuthorCtrl
);
authorRoute.delete(
  `/deleteAuthor/:authorId`,
  isLoggedInAndVerified,
  isAdmin,
  deleteAuthorCtrl
);

authorRoute.get('/', getAllAuthorsCtrl)

module.exports = authorRoute;
