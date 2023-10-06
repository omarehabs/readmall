const Category = require('../models/CategoryUtils');
const {errorHandler} = require('../utils/errorHandler');
const successHandler = require('../utils/successHandler');

async function addCategoryCtrl(req, res) {
  const { categoryName } = req.body;
  if (!categoryName) {
    return errorHandler(res, 400, { message: 'categoryName must be provided.' });
  }

  try {
    const newCat = await Category.addCategory(categoryName);

    return successHandler(res, 400, 'New Category added successfully.', {
      category: newCat,
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }

}

async function getCategoryByIdCtrl(req, res) {
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    return errorHandler(res, 400, { message: 'categoryId is required' });
  }

  try {
    const catFound = await Category.getCategory(categoryId);
    if (catFound) {
      return successHandler(res, 200, 'Category found successfully.', {
        category: catFound,
      });
    }
    return errorHandler(res, 400, {
      message: 'No category with such ID.',
    });

  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function updateCategoryCtrl(req, res) {
  const { categoryName } = req.body;
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    return errorHandler(res, 400, { message: 'categoryId is required' });
  }
  if (!categoryName) {
    return errorHandler(res, 400, { message: "categoryName is required!" });
  }

  try {
    const catUpdated = await Category.updateCategory(categoryId, categoryName);

    if (catUpdated[0] > 0) {
      return successHandler(res, 200, `${catUpdated[0]} Category updated successfully.`, {
        categoryUpdated: catUpdated[1]
      });
    }

    return errorHandler(res, 400, {
      message: 'No category with such ID to update!',
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function deleteCategortCtrl(req, res) {
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    return errorHandler(res, 400, { message: 'categoryId is required' });
  }
  try {
    const categoryDeleted = await Category.deleteCategory(categoryId);
    if (categoryDeleted) {
      return successHandler(res, 200, 'Category deleted successfully.', {
        categoryDeleted
      });
    }
    return errorHandler(res, 400, {
      message: 'No Author with such ID to delete.',
    });

  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getAllCategoriesCtrl(req, res) {
  try {
    const categories = await Category.getAllCategories();

    if (categories.length > 0) {
      return successHandler(res, 200, 'got all categories successfully', { categories });
    }
    return errorHandler(res, 503, { message: 'server error please try again later' });
  } catch (e) {
    return errorHandler(res, 404, e);
  }
}

module.exports = {
  addCategoryCtrl,
  getCategoryByIdCtrl,
  updateCategoryCtrl,
  deleteCategortCtrl,
  getAllCategoriesCtrl
};
