import { Router } from "express";
import { postComments } from "../controllers/commentsController.js";

const commentsRouter = Router();

commentsRouter.post(`/post/:postId/comment`, postComments);

export default commentsRouter;
