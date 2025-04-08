const Joi = require("joi");

/**
 * Middleware tạo sẵn để validate request body bằng Joi schema.
 * @param {Joi.Schema} schema - Joi schema để validate.
 * @returns {Function} Middleware function cho Express.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({ status: 'error', errors });
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
