const { Op } = require("sequelize");
const Book = require("./schemas/BookSchema");
const Author = require("./schemas/AuthorSchema");
const Publisher = require("./schemas/PublisherSchema");
const User = require("./schemas/UserSchema");
const Category = require("./schemas/CategorySchema");
const Review = require("./schemas/ReviewSchema.js");

const sequelize = require("../config/dbConfig");
const handlePagination = require("../utils/handlePagination.js");
Book.getBookById = async (bookId) => {
  const book = await Book.findOne({
    attributes: {
      include: [
        [
          sequelize.literal(
            `(SELECT AVG(rate) FROM "reviews" WHERE "reviews"."bookId" = ${bookId})`
          ),
          "totalReviewsRate",
        ],
      ],
    },
    where: { id: bookId },
    include: [
      { model: Author, attributes: ["authorName", "id"] },
      { model: Publisher, attributes: ["publisherName", "id"] },
      { model: User, attributes: ["fullname", "id"] },
      { model: Category, attributes: ["categoryName", "id"] },
      {
        model: Review,
        as: "reviews",

        attributes: ["rate", "comment", "id"],
        include: [
          {
            model: User,
            attributes: ["id", "fullname", "avatarUrl"],
          },
        ],
      },
    ],
  });
  if (!book) throw new Error("There no book with such ID.");
  const recommendations = await Book.findAll({
    where: { categoryId: book.categoryId },
    include: [
      { model: Author, attributes: ["authorName", "id"] },
      { model: Publisher, attributes: ["publisherName", "id"] },
      { model: User, attributes: ["fullname", "id"] },
      { model: Category, attributes: ["categoryName", "id"] },
      {
        model: Review,
        as: "reviews",

        attributes: ["rate", "comment", "id"],
        include: [
          {
            model: User,
            attributes: ["id", "fullname", "avatarUrl"],
          },
        ],
      },
    ],
    order: [["updatedAt", "DESC"]],
    limit: 5,
  });
  return { book, recommendations };
};

Book.findByCategoryId = async function (categoryId, limit, page) {
  const whereObj = { categoryId }

  const books = await Book.findAll({
    where: whereObj,
    include: [
      { model: Author, attributes: ["authorName", "id"] },
      { model: Publisher, attributes: ["publisherName", "id"] },
      { model: User, attributes: ["fullname", "id"] },
      { model: Category, attributes: ["categoryName", "id"] },
      {
        model: Review,
        as: "reviews",

        attributes: ["rate", "comment", "id"],
        include: [
          {
            model: User,
            attributes: ["id", "fullname", "avatarUrl"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
    ...handlePagination(limit, page),
  });

  const booksCount = await Book.count({ where: whereObj })

  const rates = await Review.getBooksTotalRate(books.map((book) => {
    const bk = book.toJSON()
    return bk.id
  }))

  const mappedBooksWithRate = books.map((book) => {
    const bk = book.toJSON()
    let rate = rates.find((bookRate) => bookRate.dataValues.bookId === bk.id)
    return { ...bk, totalReviewsRate: +rate?.dataValues.avgRating ?? 0 }
  })


  return { count: booksCount, rows: mappedBooksWithRate };
};

Book.findByMostViewed = async function (limit, page) {

  const booksCount = await Book.count()

  const books = await Book.findAll({

    include: [

      { model: Author, attributes: ["authorName", "id"] },
      { model: Publisher, attributes: ["publisherName", "id"] },
      { model: User, attributes: ["fullname", "id"] },
      { model: Category, attributes: ["categoryName", "id"] },
      {
        model: Review,
        as: "reviews",

        attributes: ["rate", "comment", "id"],
        include: [
          {
            model: User,
            attributes: ["id", "fullname", "avatarUrl"],
          },
        ],
      },
    ],
    order: [["views", "DESC"]],
    ...handlePagination(limit, page),
  });


  const rates = await Review.getBooksTotalRate(books.map((book) => {
    const bk = book.toJSON()
    return bk.id
  }))
  const mappedBooksWithRate = books.map((book) => {
    const bk = book.toJSON()
    let rate = rates.find((bookRate) => bookRate.dataValues.bookId === bk.id)
    return { ...bk, totalReviewsRate: +rate?.dataValues.avgRating ?? 0 }
  })


  return { count: booksCount, rows: mappedBooksWithRate };
};

Book.getBooksByAuthorId = async function (authorId, limit, page) {

  const whereObj = { authorId }
  const booksCount = await Book.count({ where: whereObj })

  const books = await Book.findAll({
    where: whereObj,
    include: [
      { model: Author, attributes: ["authorName", "id"] },
      { model: Publisher, attributes: ["publisherName", "id"] },
      { model: User, attributes: ["fullname", "id"] },
      { model: Category, attributes: ["categoryName", "id"] },
      {
        model: Review,
        as: "reviews",

        attributes: ["rate", "comment", "id"],
        include: [
          {
            model: User,
            attributes: ["id", "fullname", "avatarUrl"],
          },
        ],
      },
    ],
    order: [["views", "DESC"]],

    ...handlePagination(limit, page),
  });
  // if (!book) throw new Error('There no book with such ID.');
  return { count: booksCount, rows: books };
};

Book.getBooksByPublisherId = async function (publisherId, limit, page) {
  const booksCount = await Book.count()
  const books = await Book.findAll({
    where: { publisherId },
    include: [
      { model: Author, attributes: ["authorName", "id"] },
      { model: Publisher, attributes: ["publisherName", "id"] },
      { model: User, attributes: ["fullname", "id"] },
      { model: Category, attributes: ["categoryName", "id"] },
      {
        model: Review,
        as: "reviews",

        attributes: ["rate", "comment", "id"],
        include: [
          {
            model: User,
            attributes: ["id", "fullname", "avatarUrl"],
          },
        ],
      },
    ],
    order: [["views", "ASC"]],

    ...handlePagination(limit, page),
  });

  return { count: booksCount, rows: books };
};

Book.getBooksAddedRecently = async function (limit, page) {
  const books = await Book.findAll({
    include: [
      { model: Author, attributes: ["authorName", "id"] },
      { model: Publisher, attributes: ["publisherName", "id"] },
      { model: User, attributes: ["fullname", "id"] },
      { model: Category, attributes: ["categoryName", "id"] },
      {
        model: Review,
        as: "reviews",

        attributes: ["rate", "comment", "id"],
        include: [
          {
            model: User,
            attributes: ["id", "fullname", "avatarUrl"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],

    ...handlePagination(limit, page),
  });
  const booksCount = await Book.count();


  const rates = await Review.getBooksTotalRate(books.map((book) => {
    const bk = book.toJSON()
    return bk.id
  }))
  const mappedBooksWithRate = books.map((book) => {
    const bk = book.toJSON()
    let rate = rates.find((bookRate) => bookRate.dataValues.bookId === bk.id)
    return { ...bk, totalReviewsRate: +rate?.dataValues.avgRating ?? 0 }
  })


  return { count: booksCount, books: mappedBooksWithRate };
};

Book.addBook = async function (bookObj) {
  const book = await Book.create(bookObj);
  return book;
};

Book.searchBooks = async function (searchText, limit, page) {
  const whereObj = {
    [Op.or]: {
      title: { [Op.iLike]: `%${searchText}%` },
      subTitle: { [Op.iLike]: `%${searchText}%` },
    },
  }
  const booksCount = await Book.count({ where: whereObj })

  const books = await Book.findAll({
    attributes: [
      "title",
      "subTitle",
      "price",
      "format",
      "desc",
      "id",
      "coverUrl",
      "views",
      "lang",
      "copyright",
    ],
    where: whereObj,
    include: [
      { model: Author, attributes: ["authorName", "id"] },
      { model: Category, attributes: ["categoryName", "id"] },
      {
        model: Review,
        as: "reviews",

        attributes: ["rate", "comment", "id"],
        include: [
          {
            model: User,
            attributes: ["id", "fullname", "avatarUrl"],
          },
        ],
      },
    ],
    order: [["views", "ASC"]],

    ...handlePagination(limit, page),
  });

  
  const rates = await Review.getBooksTotalRate(books.map((book) => {
    const bk = book.toJSON()
    return bk.id
  }))
  
  const mappedBooksWithRate = books.map((book) => {
    const bk = book.toJSON()
    let rate = rates.find((bookRate) => bookRate.dataValues.bookId === bk.id)
    return { ...bk, totalReviewsRate: +rate?.dataValues.avgRating ?? 0 }
  })


  return { count: booksCount, rows: mappedBooksWithRate };
};

Book.fiterBooks = async function (filterObject, limit, page) {
  const {
    title,
    lang,
    releaseDate,
    format,
    copyright,
    minPrice,
    maxPrice,
    before,
    after,
  } = filterObject;
  let { authorName, categoryId } = filterObject;

  let author = {
    model: Author,
    attributes: ["authorName", "id"],
  };

  if (authorName) {
    if (authorName.trim()) {
      author.where = { authorName };
    }
  }

  let category = {
    model: Category,
    attributes: ["categoryName", "id"],
  };

  if (categoryId) {
    category.where = {
      id: categoryId,
    };
  }

  const filter = {
    include: [
      { model: Publisher, attributes: ["publisherName", "id"] },
      { model: User, attributes: ["fullname", "id"] },
      { model: Category, attributes: ["categoryName", "id"] },
      author,
      category,
      {
        model: Review,
        as: "reviews",

        attributes: ["rate", "comment", "id"],
        include: [
          {
            model: User,
            attributes: ["id", "fullname", "avatarUrl"],
          },
        ],
      },
    ],
  };

  const whereObject = {
    lang,
    releaseDate,
    format,
    copyright,
  };

  for (const key in whereObject) if (!whereObject[key]) delete whereObject[key];

  if (title) {
    if (title.trim()) {
      const titleObject = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${title}%` } },
          { subTitle: { [Op.iLike]: `%${title}%` } },
        ],
      };

      Object.assign(whereObject, titleObject);
    }
  }

  if (minPrice) {
    let price = {};
    if (maxPrice) {
      price = { [Op.between]: [minPrice, maxPrice] };
    } else {
      price = { [Op.gt]: minPrice };
    }
    whereObject.price = price;
  } else if (maxPrice) {
    let price = {};
    if (minPrice) {
      price = { [Op.between]: [minPrice, maxPrice] };
    } else {
      price = { [Op.lt]: maxPrice };
    }
    whereObject.price = price;
  }

  if (after) {
    let releaseDate = {};
    if (before) {
      releaseDate = { [Op.between]: [after, before] };
    } else {
      releaseDate = { [Op.gt]: after };
    }

    whereObject.releaseDate = releaseDate;
  } else if (before) {
    let releaseDate = {};
    if (after) {
      releaseDate = { [Op.between]: [after, before] };
    } else {
      releaseDate = { [Op.lt]: before };
    }
    whereObject.releaseDate = releaseDate;
  }

  filter.where = whereObject;
  filter.order = [["createdAt", "DESC"]];

  const books = await Book.findAll({
    ...filter,
    ...handlePagination(limit, page),
  });

  const booksCount = await Book.count(filter)
  return { count: booksCount, rows: books };
};

Book.updateBook = async function (bookId, updates) {
  return await Book.update(updates, {
    where: {
      id: bookId,
    },
    returning: true,
  });
};

Book.getBookUploaderId = async function (bookId) {
  return Book.findOne({
    where: { id: bookId },
    attributes: ["uploaderId"],
  });
};

Book.getPublisherBooks = async function (publisherId) {
  const book = await Book.findAll({
    where: { publisherId },
    include: [
      { model: Author, attributes: ["authorName"] },
      { model: Publisher, attributes: ["publisherName"] },
      { model: User, attributes: ["fullname"] },
      { model: Category, attributes: ["categoryName"] },
    ],
    order: [["views", "ASC"]],
    limit: 10,
  });
  return book;
};

Book.getAuthorBooks = async function (authorId) {
  const book = await Book.findAll({
    where: { authorId },
    include: [
      { model: Author, attributes: ["authorName"] },
      { model: Publisher, attributes: ["publisherName"] },
      { model: User, attributes: ["fullname"] },
      { model: Category, attributes: ["categoryName"] },
    ],
    order: [["views", "ASC"]],
    limit: 10,
  });
  return book;
};

Book.isBookPurchaseable = async function (bookId) {
  return Book.count({ where: { id: bookId, toBuy: true } });
};

Book.countAuthorBooks = async function (authorsIds) {
  const counts = await Book.count({ where: { authorId: { [Op.in]: authorsIds } }, group: ['authorId',] })
  return counts
}
module.exports = Book;
