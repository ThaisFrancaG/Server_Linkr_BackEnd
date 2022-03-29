import { Router } from "express";
import { toggleFollowing } from "../../controllers/followingFeatures/followerController.js";
import { validateSchema } from "../../middleware/validateSchema.js";
import { followSchema } from "../../schemas/followSchemas/followerSchema.js";

const followRouter = Router();

followRouter.post("/follow", validateSchema(followSchema), toggleFollowing);

export default followRouter;
