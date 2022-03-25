import { Router } from "express";
import { getLikes, toggleLike } from "../controllers/postsLikesController.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { likeSchema } from "../schemas/likesSchema.js";

const postLikesRouter = Router();

postLikesRouter.post("/likes", validateSchema(likeSchema), toggleLike);
postLikesRouter.get("/likes", getLikes);

export default postLikesRouter;
