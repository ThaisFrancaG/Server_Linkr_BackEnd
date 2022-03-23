import { Router } from "express";
import logOutRouter from "./logOutRoute.js";
import signInRouter from "./signInRouter.js";
import signUpRouter from "./signUpRouter.js";

const router = Router();
router.use(signInRouter);
router.use(signUpRouter);
router.use(logOutRouter);
export default router;
