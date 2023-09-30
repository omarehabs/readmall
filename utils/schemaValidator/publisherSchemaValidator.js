const Joi = require('joi');

const addPublisherSchema = Joi.object({
    publisherName: Joi.string().min(4).max(75).required(),
    license: Joi.string().min(4).max(75)

});

const updatePublisherSchema = Joi.object({
    publisherName: Joi.string().min(4).max(75),
    license: Joi.string().min(4).max(75)
}).or('publisherName', 'license');

module.exports = {
    addPublisherSchema,
    updatePublisherSchema
};