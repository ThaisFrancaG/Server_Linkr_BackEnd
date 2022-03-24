import { Router } from "express";
import {
  getPublications,
  postPublication,
} from "../controllers/postsController.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { postSchema } from "../schemas/postSchema.js";

const postsRouter = Router();

postsRouter.post("/publish", validateSchema(postSchema), postPublication);
postsRouter.get("/timeline", getPublications);

export default postsRouter;
