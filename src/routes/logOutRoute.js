import { Router } from "express";
import logOut from "../controllers/logOutController.js";

const logOutRouter = Router();

logOutRouter.delete('/logout', logOut);

export default logOutRouter