import { Router } from "express";
import { deletePost } from "../controllers/deletePostsController.js";
import {
  getPublications,
  postPublication,
  getUserPosts,
  updatePosts,
} from "../controllers/postsController.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { postSchema } from "../schemas/postSchema.js";

const postsRouter = Router();

postsRouter.post("/publish", validateSchema(postSchema), postPublication);
postsRouter.get("/timeline", getPublications);
postsRouter.get("/user/:id", getUserPosts);
postsRouter.put("/post", validateSchema(postSchema), updatePosts);
postsRouter.delete("/post", deletePost);

export default postsRouter;
