const Joi = require("joi");

const createBookSchema = Joi.object({
  title: Joi.string().min(4).max(120).required(),
  subTitle: Joi.string().max(220),
  desc: Joi.string().max(220),
  lang: Joi.string()
    .alphanum()
    .valid("arabic", "Arabic", "English", "english")
    .required(),
  releaseDate: Joi.date().required(),
  copyright: Joi.bool(),
  bookUrl: Joi.string().uri(),
  coverUrl: Joi.string().uri(),
  pages: Joi.number().integer().required(),
  authorId: Joi.number().integer().required(),
  uploaderId: Joi.number().integer().required(),
  publisherId: Joi.number().integer().required(),
  categoryId: Joi.number().integer().required(),
  toBuy: Joi.bool().required(),
});

const filterBooksSchema = Joi.object({
  title: Joi.string().min(4).max(120),
  lang: Joi.string()
    .alphanum()
    .valid(
      "arabic",
      "Arabic",
      "ar",
      "Ar",
      "AR",
      "English",
      "english",
      "EN",
      "En",
      "en",
      "ENG",
      "Eng",
      "eng"
    ),
  releaseDate: Joi.date(),
  format: Joi.string()
    .alphanum()
    .valid("pdf", "epub", "PDF", "EPUB", "Epub", "Pdf", "unavailable"),
  copyright: Joi.bool(),
  authorName: Joi.string().max(120),
  categoryId: Joi.number().integer(50),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number(),
  before: Joi.date(),
  after: Joi.date(),
}).or(
  "title",
  "lang",
  "releaseDate",
  "format",
  "copyright",
  "authorName",
  "minPrice",
  "maxPrice",
  "before",
  "after",
  "categoryId"
);

const updateBooksSchema = Joi.object({
  title: Joi.string().min(4).max(120),
  subTitle: Joi.string().max(220),
  desc: Joi.string().max(220),
  lang: Joi.string()
    .alphanum()
    .valid(
      "arabic",
      "Arabic",
      "ar",
      "Ar",
      "AR",
      "English",
      "english",
      "EN",
      "En",
      "en",
      "ENG",
      "Eng",
      "eng"
    ),
  releaseDate: Joi.date(),
  copyright: Joi.bool(),
  coverUrl: Joi.string().uri(),
  authorId: Joi.number().integer(),
  uploaderId: Joi.number().integer(),
  publisherId: Joi.number().integer(),
  categoryId: Joi.number().integer(),
}).or(
  "title",
  "subTitle",
  "desc",
  "lang",
  "releaseDate",
  "copyright",
  "coverUrl",
  "authorId",
  "uploaderId",
  "publisherId",
  "categoryId"
);

module.exports = {
  createBookSchema,
  filterBooksSchema,
  updateBooksSchema,
};
