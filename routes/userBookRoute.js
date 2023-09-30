const express = require("express");

const {   getAllPurchasedBooksCtrl
} = require("../controllers/userBookControllers");

const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const isAdmin = require("../middleware/isAdmin");

const userBookRoute = express.Router();

userBookRoute.get(
  `/getPurchasedBook`,
  isLoggedInAndVerified,
  getAllPurchasedBooksCtrl
);

module.exports = userBookRoute;
