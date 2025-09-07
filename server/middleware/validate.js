const Joi = require('joi');

exports.validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

exports.schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  customer: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('', null),
    company: Joi.string().allow('', null),
  }),
  lead: Joi.object({
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('New', 'Contacted', 'Converted', 'Lost'),
    value: Joi.number().min(0),
  }),
};
