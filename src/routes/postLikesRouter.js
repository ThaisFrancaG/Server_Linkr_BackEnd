import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema.js";
import { likeSchema } from "../schemas/likesSchema.js";
const postsRouter = Router();

postLikesRouter.post("/likes", validateSchema(likeSchema), toggleLike);

export default postLikesRouter;
