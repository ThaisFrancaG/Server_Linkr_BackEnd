import { Router } from "express";
import logOutRouter from "./logOutRoute.js";
import postLikesRouter from "./postLikesRouter.js";
import postsRouter from "./postsRoute.js";
import signInRouter from "./signInRouter.js";
import signUpRouter from "./signUpRouter.js";
import userRouter from "./userRoute.js";

const router = Router();
router.use(signInRouter);
router.use(signUpRouter);
router.use(logOutRouter);
router.use(userRouter);
router.use(postsRouter);
router.use(postLikesRouter);
export default router;
