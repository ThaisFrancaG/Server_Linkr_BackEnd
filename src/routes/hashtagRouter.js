import { Router } from "express";
import getHashtagPosts from "../controllers/hashtagsController.js";

const hashtagRouter = Router();
hashtagRouter.get("/hashtag/:hashtag", getHashtagPosts);

export default hashtagRouter;
