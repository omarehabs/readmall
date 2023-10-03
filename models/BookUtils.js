const { Op, } = require('sequelize');
const Book = require('./schemas/BookSchema');
const Author = require('./schemas/AuthorSchema');
const Publisher = require('./schemas/PublisherSchema');
const User = require('./schemas/UserSchema');
const Category = require('./schemas/CategorySchema');
const Review = require('./schemas/ReviewSchema.js');

const sequelize = require('../config/dbConfig');
const handlePagination = require('../utils/handlePagination.js');
Book.getBookById = async (bookId) => {
    const book = await Book.findOne({
        attributes: {
            include: [
                [
                    sequelize.literal(
                        `(SELECT AVG(rate) FROM "reviews" WHERE "reviews"."bookId" = ${bookId})`
                    ),
                    'totalReviewsRate',
                ],
            ]
        },
        where: { id: bookId },
        include: [

            { model: Author, attributes: ['authorName', 'id'] },
            { model: Publisher, attributes: ['publisherName', 'id'] },
            { model: User, attributes: ['fullname', 'id'] },
            { model: Category, attributes: ['categoryName', 'id'] },
            {
                model: Review, as: 'reviews',

                attributes: ['rate', 'comment', 'id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fullname','avatarUrl']
                    },


                ],


            },
        ],
    });
    if (!book) throw new Error('There no book with such ID.');
    const recommendations = await Book.findAll({
        where: { categoryId : book.categoryId},
        include: [
            { model: Author, attributes: ['authorName', 'id'] },
            { model: Publisher, attributes: ['publisherName', 'id'] },
            { model: User, attributes: ['fullname', 'id'] },
            { model: Category, attributes: ['categoryName', 'id'] },
            {
                model: Review, as: 'reviews',

                attributes: ['rate', 'comment', 'id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fullname','avatarUrl']
                    },


                ],


            },
        ],
        order: [['updatedAt', 'DESC']],
        limit: 5
    })
    console.log(   book);
    return {book,recommendations };
};

Book.findByCategoryId = async function (categoryId, limit, page) {
    const book = await Book.findAndCountAll({
        where: { categoryId },
        include: [
            { model: Author, attributes: ['authorName', 'id'] },
            { model: Publisher, attributes: ['publisherName', 'id'] },
            { model: User, attributes: ['fullname', 'id'] },
            { model: Category, attributes: ['categoryName', 'id'] },
            {
                model: Review, as: 'reviews',

                attributes: ['rate', 'comment', 'id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fullname','avatarUrl']
                    },


                ],


            },
        ],
        order: [['createdAt', 'DESC']],
        ...handlePagination(limit, page)
    });
    // if (!book) throw new Error('There no book with such ID.');
    return book;
};

Book.findByMostViewed = async function (limit, page) {
    const book = await Book.findAndCountAll({
        include: [
            { model: Author, attributes: ['authorName', 'id'] },
            { model: Publisher, attributes: ['publisherName', 'id'] },
            { model: User, attributes: ['fullname', 'id'] },
            { model: Category, attributes: ['categoryName', 'id'] },
            {
                model: Review, as: 'reviews',

                attributes: ['rate', 'comment', 'id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fullname','avatarUrl']
                    },


                ],


            },
        ],
        logging: console.log,
        order: [['views', 'DESC']],
        ...handlePagination(limit, page)
    });
    // if (!book) throw new Error('There no book with such ID.');
    return book;
};

Book.getBooksByAuthorId = async function (authorId, limit, page) {
    const book = await Book.findAndCountAll({
        where: { authorId },
        include: [
            { model: Author, attributes: ['authorName', 'id'] },
            { model: Publisher, attributes: ['publisherName', 'id'] },
            { model: User, attributes: ['fullname', 'id'] },
            { model: Category, attributes: ['categoryName', 'id'] },
            {
                model: Review, as: 'reviews',

                attributes: ['rate', 'comment', 'id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fullname','avatarUrl']
                    },


                ],


            },
        ],
        order: [['views', 'DESC']],

        ...handlePagination(limit, page)
    });
    // if (!book) throw new Error('There no book with such ID.');
    return book;
};

Book.getBooksByPublisherId = async function (publisherId, limit, page) {
    const book = await Book.findAndCountAll({
        where: { publisherId },
        include: [
            { model: Author, attributes: ['authorName', 'id'] },
            { model: Publisher, attributes: ['publisherName', 'id'] },
            { model: User, attributes: ['fullname', 'id'] },
            { model: Category, attributes: ['categoryName', 'id'] },
            {
                model: Review, as: 'reviews',

                attributes: ['rate', 'comment', 'id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fullname','avatarUrl']
                    },


                ],


            },
        ],
        order: [['views', 'ASC']],

        ...handlePagination(limit, page)
    });
    // if (!book) throw new Error('There no book with such ID.');
    return book;
};

Book.getBooksAddedRecently = async function (limit, page) {
    const book = await Book.findAndCountAll({
        include: [
            { model: Author, attributes: ['authorName', 'id'] },
            { model: Publisher, attributes: ['publisherName', 'id'] },
            { model: User, attributes: ['fullname', 'id'] },
            { model: Category, attributes: ['categoryName', 'id'] },
            {
                model: Review, as: 'reviews',

                attributes: ['rate', 'comment', 'id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fullname','avatarUrl']
                    },


                ],


            },
        ],
        order: [['createdAt', 'DESC']],

        ...handlePagination(limit, page)
    });
    // if (!book) throw new Error('There no book with such ID.');
    return book;
};

Book.addBook = async function (bookObj) {
    const book = await Book.create(bookObj);
    return book;
};

Book.searchBooks = async function (searchText, limit, page) {
    const books = await Book.findAndCountAll({
        attributes: ['title', 'subTitle', 'price', 'format', 'desc', 'id', 'coverUrl', 'views', 'lang', 'copyright'],
        where: {
            [Op.or]: {
                title: { [Op.iLike]: `%${searchText}%` },
                subTitle: { [Op.iLike]: `%${searchText}%` },
            }
        },
        include: [
            { model: Author, attributes: ['authorName', 'id'] },
            { model: Category, attributes: ['categoryName', 'id'] },
            {
                model: Review, as: 'reviews',

                attributes: ['rate', 'comment', 'id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fullname','avatarUrl']
                    },


                ],


            },
        ],
        order: [['views', 'ASC']],

        ...handlePagination(limit, page)
    });
    return books;
};

Book.fiterBooks = async function (filterObject, limit, page) {
    const { title,
        lang, releaseDate,
        format, copyright,
        minPrice, maxPrice, before, after } = filterObject;
    let { authorName, categoryId } = filterObject;

    let author = {
        model: Author,
        attributes: ['authorName', 'id']
    };

    if (authorName) {
        if (authorName.trim()) {
            author.where = { authorName };
        }
    }

    let category = {
        model: Category,
        attributes: ['categoryName', 'id']
    };

    if (categoryId) {
        category.where = {
            id: categoryId
        };
    }

    const filter = {
        include: [
            { model: Publisher, attributes: ['publisherName', 'id'] },
            { model: User, attributes: ['fullname', 'id'] },
            { model: Category, attributes: ['categoryName', 'id'] },
            author,
            category,
            {
                model: Review, as: 'reviews',

                attributes: ['rate', 'comment', 'id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'fullname','avatarUrl']
                    },


                ],


            },
        ]

    };

    const whereObject = {
        lang, releaseDate,
        format, copyright,
    };

    for (const key in whereObject)
        if (!whereObject[key]) delete whereObject[key];

    if (title) {
        if (title.trim()) {


            const titleObject = {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${title}%` } },
                    { subTitle: { [Op.iLike]: `%${title}%` } },
                ]

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
    filter.order = [['createdAt', 'DESC']];

    const books = await Book.findAndCountAll({
        ...filter,
        ...handlePagination(limit, page)
    });
    return books;
};

Book.updateBook = async function (bookId, updates) {
    return await Book.update(updates, {
        where: {
            id: bookId
        },
        returning: true,


    },
    );
};

Book.getBookUploaderId = async function (bookId) {
    return Book.findOne({
        where: { id: bookId },
        attributes: ['uploaderId']
    });
};


Book.getPublisherBooks = async function (publisherId) {
    const book = await Book.findAll({
        where: { publisherId },
        include: [
            { model: Author, attributes: ['authorName'] },
            { model: Publisher, attributes: ['publisherName'] },
            { model: User, attributes: ['fullname'] },
            { model: Category, attributes: ['categoryName'] },
           
        ],
        order: [['views', 'ASC']],
        limit: 10
    });;
    return book;
};

Book.getAuthorBooks = async function (authorId) {
    const book = await Book.findAll({
        where: { authorId },
        include: [
            { model: Author, attributes: ['authorName'] },
            { model: Publisher, attributes: ['publisherName'] },
            { model: User, attributes: ['fullname'] },
            { model: Category, attributes: ['categoryName'] },
           
        ],
        order: [['views', 'ASC']],
        limit: 10
    });;
    return book;
};
module.exports = Book;
