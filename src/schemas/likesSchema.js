import Joi from "joi";

export const likeSchema = Joi.object({
  postId: Joi.number().required(),
  token: Joi.string().required(),
  liked: Joi.bool(),
});
