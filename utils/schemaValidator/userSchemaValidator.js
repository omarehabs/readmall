const Joi = require('joi');

const signupUserSchema = Joi.object({
    fullname: Joi.string().min(4).max(120).required(),
    address: Joi.string().max(220),
    email: Joi.string().email().max(85).required(),
    password: Joi.string().min(8).max(110).required(),
    phoneNum: Joi.string(),
    role: Joi.string().alphanum().valid('basic', 'Basic', 'admin', 'Admin'),
    gender: Joi.string().alphanum().valid('male', 'female', 'Male', 'Female'),
    avatarUrl: Joi.string().uri(),
});

const updateUserSchema = Joi.object({
    fullname: Joi.string().min(4).max(120),
    address: Joi.string().max(220),
    email: Joi.string().email().max(85),
    password: Joi.string().min(8).max(110),
    phoneNum: Joi.string(),
    avatarUrl: Joi.string(),
    gender: Joi.string().valid('male', 'female')
}).or('fullname', 'address', 'email', 'password', 'phoneNum', 'avatarUrl',);

module.exports = {
    signupUserSchema,
    updateUserSchema
};