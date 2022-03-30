import Joi from "joi";

const expression =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

export const postSchema = Joi.object({
  link: Joi.string().pattern(expression).uri().required(),
  description: Joi.string().allow(""),
  id: Joi.number(),
});
