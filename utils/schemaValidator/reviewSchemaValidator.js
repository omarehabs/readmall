const Joi = require('joi');

const createReviewSchema = Joi.object({
    comment: Joi.string().min(4).max(120).required(),
    rate: Joi.number().integer().min(0).max(10).required(),
    userId: Joi.number().integer().required(),
    bookId: Joi.number().integer().required()
});


const updateReviewSchema = Joi.object({
    comment: Joi.string().min(4).max(120),
    rate: Joi.number().integer().min(0).max(5)
}).or('comment', 'rate');


module.exports = {
    updateReviewSchema,
    createReviewSchema
};