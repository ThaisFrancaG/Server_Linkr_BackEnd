import { Router } from "express";
import signInRouter from "./signInRouter.js";
import signUpRouter from "./signUpRouter.js";

const router = Router();
router.use(signInRouter);
router.use(signUpRouter);
export default router;
