const Book = require("./BookUtils");
const Favorite = require("./schemas/FavoriteSchema");
const handlePaginaton = require('../utils/handlePagination')
Favorite.addFavoriteBook = async function (favObj) {
  return Favorite.create(favObj);
};

Favorite.deleteFavoriteBook = async function (favObj) {
  return Favorite.destroy({ where: favObj });
};

Favorite.getAllFavoriteBooks = async function (userId,limit, page ) {
  return Favorite.findAndCountAll({
    where: { userId },
    include: [{ model: Book }],
    ...handlePaginaton(limit, page )
  });
};


Favorite.userFavoritedBook = async function (userId, bookId){
  return Favorite.count({where: {userId, bookId}})
}

module.exports = Favorite;
