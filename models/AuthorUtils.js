const { Op } = require("sequelize");
const Author = require("./schemas/AuthorSchema");
const Book = require("./schemas/BookSchema");

Author.createAuthor = async function (authorObj) {
  const authorCreated = await Author.create(authorObj);
  return authorCreated;
};
Author.getAllAuthors = async function () {
  const authors = await Author.findAll();
  const numOfAuthors = await Author.count()
  return {authors, numOfAuthors};
};

Author.getAuthorById = async function (id) {
  const author = await Author.findOne({
    where: { id },
  });
  if (!author) throw new Error("There no author with such ID.");
  return author;
};

Author.getAuthorByName = async function (authorName) {
  const name = authorName.trim().split("").join("%");
  const authorFound = await Author.findAll({
    where: {
      authorName: { [Op.iLike]: `%${name}%` },
    },
  });
  if (!authorFound) throw new Error("There is no author with such name.");
  return authorFound;
};

Author.updateAuthor = async function (authorId, updatesObj) {
  return await Author.update(updatesObj, {
    where: {
      id: authorId,
    },
    returning: true,
  });
};

Author.deleteAuthor = async function (authorId) {
  return await Author.destroy({ where: { id: authorId } });
};

module.exports = Author;
