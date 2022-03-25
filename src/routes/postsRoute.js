import { Router } from "express";
import {
  getPublications,
  postPublication,
  getUserPosts
} from "../controllers/postsController.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { postSchema } from "../schemas/postSchema.js";

const postsRouter = Router();

postsRouter.post("/publish", validateSchema(postSchema), postPublication);
postsRouter.get("/timeline", getPublications);
postsRouter.get('/user/:id', getUserPosts)

export default postsRouter;
