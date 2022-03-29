import Joi from "joi";

export const followSchema = Joi.object({
  userId: Joi.number().required(),
});
