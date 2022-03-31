import { Router } from "express";
import { getComments, postComments } from "../controllers/commentsController.js";

const commentsRouter = Router();

commentsRouter.post('/post/:postId/comment', postComments);
commentsRouter.get('/post/:postId/comment', getComments);

export default commentsRouter;
