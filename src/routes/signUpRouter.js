import { Router } from "express";
import { signUp } from "../controllers/signUpController";
import { validateSchema } from "../middleware/validateSchema";
import signUpSchema from "../schemas/signUpSchema";

const signUpRouter = Router();
signUpRouter.post("/sign-up", validateSchema(signUpSchema), signUp);

export default signUpRouter;
