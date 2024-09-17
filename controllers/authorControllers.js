const Author = require('../models/AuthorUtils');
const Book = require('../models/BookUtils');
const { addAuthorSchema, updateAuthorSchema } = require('../utils/schemaValidator/authorSchemaValidator');
const { errorHandler } = require('../utils/errorHandler');
const successHandler = require('../utils/successHandler');
const handleNumOfPages = require('../utils/handleNumOfPages')

async function createAuthorCtrl(req, res) {
  const { value, error } = addAuthorSchema.validate(req.body);
  if (error) {
    return errorHandler(res, 400, error);
  }

  try {
    const authorCreated = await Author.createAuthor(value);
    return successHandler(res, 400, 'Author created successfully.', { author: authorCreated });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getAuthorByIdCtrl(req, res) {
  const authorId = req.params.authorId;
  if (!authorId) {
    return errorHandler(res, 400, { message: 'authorId is required' });
  }

  try {
    const authorFound = await Author.getAuthorById(authorId);

    if (authorFound) {
      const books = await Book.getAuthorBooks(authorId)
      return successHandler(res, 200, 'Authore found successfully.', {
        author: authorFound,
        books
      });
    }
    return errorHandler(res, 400, {
      message: 'No Author with such ID.',
    });

  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function findAuthorByNameCtrl(req, res) {
  const authorName = req.query.name;
  if (!authorName) {
    return errorHandler(res, 400, {
      message: 'authorName is required!'
    });
  }
  try {
    const authorsFound = await Author.getAuthorByName(authorName);
    if (authorsFound.length === 0) {
      return successHandler(res, 200, 'found no authors with such name.', { authors: [] });
    }
    const authorsBooks = await Book.countAuthorBooks(authorsFound.map((author) => {
      const auth = author.toJSON()
      return auth.id
    }));

    const mappedAuthors = authorsFound.map((author) => {
      const auth = author.toJSON()
      const count = authorsBooks.find((co) => co.authorId === author.id)
      return { ...auth, numOfBooks: count?.count ?? 0 }
    })
    return successHandler(res, 200, `found ${authorsFound.length} authors successfully.`,
      { authors: mappedAuthors, },
    );

  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function updateAuthorCtrl(req, res) {
  const authorId = req.params.authorId;
  if (req.file) {
    req.body.authorAvatarUrl = req.body.imagePath + '/' + req.body.imageName
    delete req.body.imagePath
    delete req.body.imageName
  }
  const { value, error } = updateAuthorSchema.validate(req.body);
  if (!authorId) {
    return errorHandler(res, 400, { message: 'authorId is required' });
  }
  if (error) {
    return errorHandler(res, 400, error);
  }

  try {
    const author = await Author.updateAuthor(authorId, value);

    if (author[0] > 0) {
      return successHandler(res, 200, `${author[0]} Author updated successfully.`, {
        authorUpdated: author[1]
      });
    }
    return errorHandler(res, 400, {
      message: 'No Author with such ID to update.',
    });

  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getAllAuthorsCtrl(req, res) {
  const { limit, page } = req.query;
  try {
    const authors = await Author.getAllAuthors(
      limit,
      page
    );
    if (authors.numOfAuthors === 0) {
      return successHandler(res, 200, "no authors added yet", {
        numOfPages: 0,
        authors: [],
      });
    }

    const authorsBooks = await Book.countAuthorBooks(authors.authors.map((author) => {
      const auth = author.toJSON()
      return auth.id
    }));

    const mappedAuthors = authors.authors.map((author) => {
      const auth = author.toJSON()
      const count = authorsBooks.find((co) => co.authorId === author.id)
      return { ...auth, numOfBooks: count?.count ?? 0 }
    })
    return successHandler(res, 200, `found authors successfully.`, {
      numOfPages: handleNumOfPages(authors.numOfAuthors, limit, 10),
      authors: mappedAuthors,
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function deleteAuthorCtrl(req, res) {
  const authorId = req.params.authorId;
  if (!authorId) {
    return errorHandler(res, 400, { message: 'authorId is required' });
  }

  try {
    const authorDeleted = await Author.deleteAuthor(authorId);
    if (authorDeleted) {
      return successHandler(res, 200, 'Author deleted successfully.', {
        authorDeleted
      });
    }
    return errorHandler(res, 400, {
      message: 'No Author with such ID to delete.',
    });

  } catch (e) {
    return errorHandler(res, 400, e);
  }

}
module.exports = {
  createAuthorCtrl,
  getAuthorByIdCtrl,
  findAuthorByNameCtrl,
  updateAuthorCtrl,
  deleteAuthorCtrl,
  getAllAuthorsCtrl
};
