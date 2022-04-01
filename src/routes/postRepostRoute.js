import { Router } from "express";
import { addRepost, /*getReposts*/ } from "../controllers/postRepostController.js";
import validateUserToken from "../middleware/validateUser.js";

const postRepostRouter = Router();

postRepostRouter.post("/reposting", validateUserToken, addRepost);
//postRepostRouter.get("/reposting", validateUserToken, getReposts);

export default postRepostRouter;
