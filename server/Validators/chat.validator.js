const Joi = require("joi");
const mongoose = require("mongoose");

const isObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};

const createChatSchema = Joi.object({
  firstId: Joi.string().custom(isObjectId).required(),
  secondId: Joi.string().custom(isObjectId).required(),
});

module.exports = {
  createChatSchema,
};
