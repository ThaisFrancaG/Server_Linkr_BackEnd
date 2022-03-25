import { Router } from "express";
import { getUserData, getUsers } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get('/user-data/:token', getUserData)
userRouter.get('/users', getUsers)

export default userRouter;