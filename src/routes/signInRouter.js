import { Router } from "express";
import { signIn } from "../controllers/signInController.js";

const signInRouter = Router();

signInRouter.post("/login", signIn);
export default signInRouter;
