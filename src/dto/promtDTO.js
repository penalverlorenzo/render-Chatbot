import Joi from "joi";

const message = Joi.string().max(50);

export const promptSchema = Joi.object({
  message: message.required(),
});
