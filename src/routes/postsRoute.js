import { Router } from "express";
import { postPublication } from "../controllers/postsController.js";
import { validateSchema } from "../middleware/validateSchema.js";
import { postSchema } from "../schemas/postSchema.js";

const postsRouter = Router();

postsRouter.post("/publish", validateSchema(postSchema), postPublication);

export default postsRouter;
