const Joi = require('joi');

const addAuthorSchema = Joi.object({
    authorName: Joi.string().min(4).max(75).required(),
    bio: Joi.string().max(550),
    birthDate: Joi.date().required(),
    deathDate: Joi.date(),
    authorAvatarUrl: Joi.string().uri(),
});

const updateAuthorSchema = Joi.object({
    authorName: Joi.string().min(4).max(75),
    bio: Joi.string().max(550),
    birthDate: Joi.date(),
    deathDate: Joi.date(),
    authorAvatarUrl: Joi.string()
}).or('authorName',
    'bio',
    'birthDate',
    'deathDate',
    'authorAvatarUrl',);

module.exports = {
    addAuthorSchema,
    updateAuthorSchema
};