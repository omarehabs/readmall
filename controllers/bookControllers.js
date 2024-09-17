const { PDFDocument } = require("pdf-lib");
const Book = require("../models/BookUtils");
const Favorite = require("../models/FavoriteUtils");
const Cart = require("../models/CartUtils");
const UserBook = require("../models/UserBookUtils");
const Review = require("../models/ReviewUtils");
const { errorHandler } = require("../utils/errorHandler");
const successHandler = require("../utils/successHandler");
const handleNumOfPages = require("../utils/handleNumOfPages");
const {
  createBookSchema,
  filterBooksSchema,
  updateBooksSchema,
} = require("../utils/schemaValidator/bookSchemaValidator");

const { uploadToS3Bucket, getFileSignedUrl } = require("../helpers/s3");
const nameFiles = require("../utils/nameFilesUrl");
const bucketName = process.env.AWS_BUCKET_NAME;

async function getBookByIdCtrl(req, res) {
  const id = req.params.id;
  const userId = req.userId;
  if (!id) {
    return errorHandler(res, 404, "bookId is required!");
  }


  try {
    let { book, recommendations } = await Book.getBookById(id);
    if (book) {
      await book.increment("views", { by: 1 });
      // if (book.bookUrl.includes(".pdf")) {
      //   const bookUrl = await getFileSignedUrl(bucketName, book.bookUrl, 45);
      //   book.bookUrl = bookUrl;
      // }
      if (userId) {
        book = book.toJSON()
        book["isFav"] = await Favorite.userFavoritedBook(userId, id) ? true : false;
        book["inCart"] = await Cart.userAddedBookToCart(userId, id) ? true : false;
        book["isBoughtBook"] = await UserBook.userPurchasedBook(userId, id) ? true : false;
        book["isReviewed"] = await Review.userReviewedBook(userId, id) ? true : false;
      }
      return successHandler(res, 200, "find book succeffully", {
        book,
        recommendations,
      });
    } else {
      return successHandler(res, 200, "there is no book with such ID");
    }
  } catch (e) {
    errorHandler(res, 404, e);
  }
}

async function addBookCtrl(req, res) {

  // let files = [];
  // if (req.files != null) {
  //   const arr = (req.files).map((file) => {
  //     return { path: path + "/" + file.filename };
  //   });
  //   files = arr;
  // }
  // if (!files.pdf || !files.cover) {
  //   return errorHandler(res, 400, {
  //     message: "pdf file and book cover are required!",
  //   });
  // }


  const pdf = req.files.pdf[0];
  const pdfTitle = req.body.path + "/" + pdf.filename

  const cover = req.files.cover[0];
  const coverTitle = req.body.path + "/" + cover.filename
  delete req.body.path
  const { value, error } = createBookSchema.validate(req.body);
  if (error) {
    return errorHandler(res, 400, error);
  }
  value.coverUrl = coverTitle;
  value.bookUrl = pdfTitle;
  value.size = pdf.size;
  try {
    // const pdfDoc = await PDFDocument.load(pdf.buffer);
    value.pages = 100 //pdfDoc.getPageCount();
    // const metaDataOfPdf = await uploadToS3Bucket(bucketName, pdfTitle, pdf.buffer, pdf.type);
    // const statusCodeResPdf = metaDataOfPdf['$metadata']['httpStatusCode'];
    // if (statusCodeResPdf !== 200) {
    //   return errorHandler(res, 503, { message: 'an error occurred while uplaoding the pdf file please try again!' });
    // }

    // const metaDataOfCover = await uploadToS3Bucket(bucketName, pdfTitle, pdf.buffer, pdf.type);
    // const statusCodeResCover = metaDataOfCover['$metadata']['httpStatusCode'];
    // if (statusCodeResCover !== 200) {
    //   return errorHandler(res, 503, { message: 'an error occurred while uplaoding the pdf cover please try again!' });
    // }

    const book = await Book.addBook(value);
    if (book) {
      return successHandler(res, 201, "A new book was added.", { book });
    }
  } catch (e) {
    return errorHandler(res, 404, e);
  }
}

async function getCategoryBooksCtrl(req, res) {
  const categoryId = req.params.categoryId;
  const { limit, page } = req.query;
  if (isNaN(categoryId))
    return errorHandler(res, 400, { message: "categoryId must be a number" });
  try {
    const { rows: books, count } = await Book.findByCategoryId(
      categoryId,
      limit,
      page
    );
    if (books.length === 0) {
      return successHandler(res, 200, "no books found for such category", {
        numOfPages: 0,
        books: [],
      });
    }
    return successHandler(
      res,
      200,
      `found ${books.length} successfully for this category`,
      { numOfPages: handleNumOfPages(count, limit, 10), books }
    );
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getMostViewedBooksCtrl(req, res) {
  const { limit, page } = req.query;
  try {
    const { rows: books, count } = await Book.findByMostViewed(limit, page);
    if (books.length === 0) {
      return successHandler(res, 200, "no books added yet", {
        numOfPages: 0,
        books: [],
      });
    }
    return successHandler(res, 200, `found books successfully.`, {
      numOfPages: handleNumOfPages(count, limit, 10),
      books,
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getBooksByAuthorIdCtrl(req, res) {
  const { limit, page } = req.query;
  const authorId = req.params.authorId;
  if (isNaN(authorId)) {
    return errorHandler(res, 400, { message: "authorId must be integer" });
  }
  try {
    const { rows: books, count } = await Book.getBooksByAuthorId(
      authorId,
      limit,
      page
    );
    if (books.length === 0) {
      return successHandler(res, 200, "no books for such author ID", {
        numOfPages: 0,
        books: [],
      });
    }
    return successHandler(
      res,
      200,
      `found ${books.length} books successfully fot this author.`,
      { numOfPages: handleNumOfPages(count, limit, 10), books }
    );
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getBooksByPublisherIdCtrl(req, res) {
  const publisherId = req.params.publisherId;
  const { limit, page } = req.query;
  if (isNaN(publisherId)) {
    return errorHandler(res, 400, { message: "publisherId must be integer" });
  }
  try {
    const { rows: books, count } = await Book.getBooksByPublisherId(
      publisherId,
      limit,
      page
    );
    if (books.length === 0) {
      return successHandler(res, 200, "no books for such publisher ID", {
        numOfPages: 0,
        books: [],
      });
    }
    return successHandler(
      res,
      200,
      `found ${books.length} books successfully for this publisher.`,
      { numOfPages: handleNumOfPages(count, limit, 10), books }
    );
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getRecentlyUploadedBooks(req, res) {
  const { limit, page } = req.query;
  try {
    const books = await Book.getBooksAddedRecently(
      limit,
      page
    );
    if (books.length === 0) {
      return successHandler(res, 200, "no books added yet", {
        numOfPages: 0,
        books: [],
      });
    }
    return successHandler(res, 200, `found books successfully.`, {
      numOfPages: handleNumOfPages(books.count, limit, 10),
      books: books.books,
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function searchBooksCtrl(req, res) {
  const { limit, page } = req.query;
  const searchText = req.query.q;
  if (searchText.trim().length === 0) {
    return errorHandler(res, 400, {
      message: "You must provide a value to search for.",
    });
  }

  try {
    const { rows: books, count } = await Book.searchBooks(
      searchText,
      limit,
      page
    );
    if (books.length === 0) {
      return successHandler(res, 200, "no books found for this search text", {
        numOfPages: 0,
        books: [],
      });
    }
    return successHandler(
      res,
      200,
      `found ${books.length} books successfully`,
      { numOfPages: handleNumOfPages(count, limit, 10), books }
    );
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function filterBooksCtrl(req, res) {
  const { limit, page } = req.query;
  const { value, error } = filterBooksSchema.validate(req.body);
  if (error) {
    return errorHandler(res, 400, error);
  }
  try {
    const { rows: books, count } = await Book.fiterBooks(value, limit, page);
    if (books.length === 0) {
      return successHandler(res, 200, "no books found", {
        numOfPages: 0,
        books: [],
      });
    }
    return successHandler(res, 200, `found ${books.length} books`, {
      numOfPages: handleNumOfPages(count, limit, 10),
      books,
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function updateBookCtrl(req, res) {
  const bookId = req.params.bookId;
  const { value, error } = updateBooksSchema.validate(req.body);

  if (!bookId) {
    return errorHandler(res, 404, { message: "bookId is required!" });
  }

  if (error) {
    return errorHandler(res, 404, error);
  }

  try {
    // const uploaderId = await Book.getBookUploaderId(bookId);
    // if (req.userId !== uploaderId) {
    //   return errorHandler(res, 403, { message: 'you are not authorized to update this book' });
    // }
    const bookUpdated = await Book.updateBook(bookId, value);
    if (bookUpdated[0] === 0) {
      return errorHandler(res, 400, {
        message: "no book with such ID to update",
      });
    }
    return successHandler(res, 200, "book updated successfully", {
      book: bookUpdated[1],
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

module.exports = {
  addBookCtrl,
  getBookByIdCtrl,
  getCategoryBooksCtrl,
  getMostViewedBooksCtrl,
  getBooksByAuthorIdCtrl,
  getBooksByPublisherIdCtrl,
  getRecentlyUploadedBooks,
  searchBooksCtrl,
  filterBooksCtrl,
  updateBookCtrl,
};
