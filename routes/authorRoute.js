const express = require("express");

const {
  createAuthorCtrl,
  getAuthorByIdCtrl,
  findAuthorByNameCtrl,
  updateAuthorCtrl,
  deleteAuthorCtrl,
} = require("../controllers/authorControllers");

const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const isAdmin = require("../middleware/isAdmin");

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
  updateAuthorCtrl
);
authorRoute.delete(
  `/deleteAuthor/:authorId`,
  isLoggedInAndVerified,
  isAdmin,
  deleteAuthorCtrl
);

module.exports = authorRoute;
