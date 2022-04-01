import { Router } from "express";
import { addRepost } from "../controllers/postRepostController.js";
import validateUserToken from "../middleware/validateUser.js";

const postRepostRouter = Router();

postRepostRouter.post("/reposting", validateUserToken, addRepost);

export default postRepostRouter;
