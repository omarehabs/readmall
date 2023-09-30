const Category = require('./schemas/CategorySchema');

Category.addCategory = async function (categoryName) {
  return await Category.create({
    categoryName,
  });
};

Category.getCategory = async function (id) {
  const catFound = await Category.findOne({ where: { id } });
  if (!catFound) throw new Error('There no category with such id.');
  return catFound;
};

Category.updateCategory = async function (id, categoryName) {
  return await Category.update({ categoryName }, {
    returning: true,
    where: {
      id
    },
  });
};

Category.getAllCategories = async function () {
  return await Category.findAll();
};

Category.deleteCategory = async function (id) {
  return await Category.destroy({ where: { id } });
};

module.exports = Category;
