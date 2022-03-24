import { Router } from "express";
import { getUserData } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get('/user/:token', getUserData)

export default userRouter;