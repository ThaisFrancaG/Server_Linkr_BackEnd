import { Router } from "express";
import { signUp } from "../controllers/signUpController.js";
import { validateSchema } from "../middleware/validateSchema.js";
import signUpSchema from "../schemas/signUpSchema.js";

const signUpRouter = Router();
signUpRouter.post("/sign-up", validateSchema(signUpSchema), signUp);

export default signUpRouter;
