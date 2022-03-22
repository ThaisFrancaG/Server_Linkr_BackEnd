import { Router } from "express";
import signInRouter from "./signInRouter.js";

const router = Router();
router.use(signInRouter);
export default router;
