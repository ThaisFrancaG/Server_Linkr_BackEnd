import { Router } from "express";
import {
  getWhoLiked,
  toggleLike,
} from "../controllers/postsLikesController.js";
import { validateSchema } from "../middleware/validateSchema.js";
import validateUserToken from "../middleware/validateUser.js";
import { likeSchema } from "../schemas/likesSchema.js";

const postLikesRouter = Router();

postLikesRouter.post(
  "/likes",
  validateUserToken,
  validateSchema(likeSchema),
  toggleLike
);
postLikesRouter.get("/likes", getWhoLiked);

export default postLikesRouter;
