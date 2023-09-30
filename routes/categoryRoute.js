const express = require("express");

const {
  addCategoryCtrl,
  getCategoryByIdCtrl,
  updateCategoryCtrl,
  deleteCategortCtrl,
  getAllCategoriesCtrl,
} = require("../controllers/categoryControllers");

const isLoggedInAndVerified = require("../middleware/isLoggedInAndVerified");
const isAdmin = require("../middleware/isAdmin");

const categoryRoute = express.Router();

categoryRoute.post(
  `/addCategory`,
  isLoggedInAndVerified,
  isAdmin,
  addCategoryCtrl
);
categoryRoute.get(`/getCategoryById/:categoryId`, getCategoryByIdCtrl);
categoryRoute.get(`/getAllCategories`, getAllCategoriesCtrl);
categoryRoute.patch(
  `/updateCategory/:categoryId`,
  isLoggedInAndVerified,
  isAdmin,
  updateCategoryCtrl
);
categoryRoute.delete(
  `/deleteCategory/:categoryId`,
  isLoggedInAndVerified,
  isAdmin,
  deleteCategortCtrl
);

module.exports = categoryRoute;
