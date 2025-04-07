const Joi = require("joi");
const mongoose = require("mongoose");

const isObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const createGroupChatSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  members: Joi.array().items(Joi.string().custom(isObjectId)).min(1).required(),
  admins: Joi.array().items(Joi.string().custom(isObjectId)).optional(),
  messages: Joi.array().items(Joi.string().custom(isObjectId)).optional(),
  lastMessage: Joi.string().custom(isObjectId).optional().allow(null),
});

const updateGroupChatSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  members: Joi.array().items(Joi.string().custom(isObjectId)).optional(),
  admins: Joi.array().items(Joi.string().custom(isObjectId)).optional(),
  messages: Joi.array().items(Joi.string().custom(isObjectId)).optional(),
  lastMessage: Joi.string().custom(isObjectId).optional().allow(null),
});

module.exports = {
  createGroupChatSchema,
  updateGroupChatSchema,
};
