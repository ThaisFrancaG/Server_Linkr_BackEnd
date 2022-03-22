import { Router } from "express";
import { signIn } from "../controllers/signInController.js";
import { validateSchema } from "../middleware/validateSchema.js";
import signInSchema from "../schemas/signInSchema.js";

const signInRouter = Router();

signInRouter.post("/login", validateSchema(signInSchema), signIn);
export default signInRouter;
