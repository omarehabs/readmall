const Publisher = require("../models/PublisherUtils");
const {
  addPublisherSchema,
  updatePublisherSchema,
} = require("../utils/schemaValidator/publisherSchemaValidator");

const { errorHandler } = require("../utils/errorHandler");
const successHandler = require("../utils/successHandler");
const Book = require("../models/BookUtils");

async function addPublisherCtrl(req, res) {
  const { value, error } = addPublisherSchema.validate(req.body);
  if (error) {
    return errorHandler(res, 400, error);
  }

  try {
    const publisherCreated = await Publisher.createPublisher(value);
    return successHandler(res, 400, "Publisher created successfully.", {
      publisher: publisherCreated,
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function getPublisherByIdCtrl(req, res) {
  const publisherId = req.params.publisherId;
  if (!publisherId) {
    return errorHandler(res, 400, { message: "publisherId is required" });
  }

  try {
    const publisherFound = await Publisher.getPublisherById(publisherId);
    if (publisherFound) {
      const books = await Book.getPublisherBooks(publisherId);
      return successHandler(res, 200, "Publisher found successfully.", {
        publisher: publisherFound,
        books,
      });
    }
    return errorHandler(res, 400, {
      message: "No publisher with such ID.",
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function findPublisherByNameCtrl(req, res) {
  const publisherName = req.query.name;
  if (!publisherName) {
    return errorHandler(res, 400, {
      message: "publisherName is required!",
    });
  }
  try {
    const publishersFound = await Publisher.getPublisherByName(publisherName);
    if (publishersFound.length === 0) {
      return successHandler(res, 200, "found no publishers with such name.", {
        publishers: [],
      });
    }
    return successHandler(
      res,
      200,
      `found ${publishersFound.length} publishers successfully.`,
      { publishers: publishersFound }
    );
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function updatePublisherCtrl(req, res) {
  const publisherId = req.params.publisherId;
  const { value, error } = updatePublisherSchema.validate(req.body);

  if (!publisherId) {
    return errorHandler(res, 400, { message: "publisherId is required" });
  }
  if (error) {
    return errorHandler(res, 400, error);
  }

  try {
    const publisher = await Publisher.updatePublisher(publisherId, value);

    if (publisher[0] > 0) {
      return successHandler(
        res,
        200,
        `${publisher[0]} Publishers updated successfully.`,
        {
          publishersUpdated: publisher[1],
        }
      );
    }
    return errorHandler(res, 400, {
      message: "No publisher with such ID to update.",
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

async function deletePublisherCtrl(req, res) {
  const publisherId = req.params.publisherId;
  if (!publisherId) {
    return errorHandler(res, 400, { message: "publisherId is required" });
  }

  try {
    const publisherDeleted = await Publisher.deletePublisher(publisherId);
    if (publisherDeleted) {
      return successHandler(res, 200, "Publisher deleted successfully.", {
        publisherDeleted,
      });
    }
    return errorHandler(res, 400, {
      message: "No Publisher with such ID to delete.",
    });
  } catch (e) {
    return errorHandler(res, 400, e);
  }
}

module.exports = {
  addPublisherCtrl,
  getPublisherByIdCtrl,
  findPublisherByNameCtrl,
  updatePublisherCtrl,
  deletePublisherCtrl,
};
