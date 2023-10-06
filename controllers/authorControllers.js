const Author = require('../models/AuthorUtils');
const Book = require('../models/BookUtils');
const { addAuthorSchema, updateAuthorSchema } = require('../utils/schemaValidator/authorSchemaValidator');
const {errorHandler} = require('../utils/errorHandler');
const successHandler = require('../utils/successHandler');

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
    return successHandler(res, 200, `found ${authorsFound.length} authors successfully.`, { authors: authorsFound, },
    );

  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function updateAuthorCtrl(req, res) {
  const authorId = req.params.authorId;
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
};
