import Joi from "joi";

export const likeSchema = Joi.object({
  postId: Joi.number(),
  userId: Joi.number(),
});
