import { Router } from "express";
import commentsRouter from "./commentsRoute.js";
import followRouter from "./followingFeaturesRoutes/followRouter.js";
import hashtagRouter from "./hashtagRouter.js";
import logOutRouter from "./logOutRoute.js";
import postLikesRouter from "./postLikesRouter.js";
import postsRouter from "./postsRoute.js";
import signInRouter from "./signInRouter.js";
import signUpRouter from "./signUpRouter.js";
import userRouter from "./userRoute.js";
import postRepostRouter from "./postRepostRoute.js";

const router = Router();
router.use(signInRouter);
router.use(signUpRouter);
router.use(logOutRouter);
router.use(userRouter);
router.use(postsRouter);
router.use(commentsRouter);
router.use(postLikesRouter);
router.use(hashtagRouter);
router.use(followRouter);
router.use(postRepostRouter);

export default router;
