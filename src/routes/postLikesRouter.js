import { Router } from "express";
import { toggleLike } from "../controllers/postsLikesController.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { likeSchema } from "../schemas/likesSchema.js";

const postLikesRouter = Router();

postLikesRouter.post("/likes", validateSchema(likeSchema), toggleLike);

export default postLikesRouter;
