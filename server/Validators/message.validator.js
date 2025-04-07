const Joi = require("joi");
const mongoose = require("mongoose");

const isObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const messageSchema = Joi.object({
  chatId: Joi.string().required(),
  senderId: Joi.string().custom(isObjectId).required(),
  receiverId: Joi.string().custom(isObjectId).required(),
  text: Joi.string().allow("", null),
  image: Joi.string().uri().allow("", null),
});

module.exports = {
  messageSchema,
};
