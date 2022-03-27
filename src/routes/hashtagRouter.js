import { Router } from "express";
import getHashtagPosts, {
  getHashtags,
} from "../controllers/hashtagsController.js";

const hashtagRouter = Router();
hashtagRouter.get("/hashtag/:hashtag", getHashtagPosts);
hashtagRouter.get("/hashtag", getHashtags);

export default hashtagRouter;
