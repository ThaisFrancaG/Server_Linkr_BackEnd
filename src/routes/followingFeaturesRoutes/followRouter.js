import { Router } from "express";
import {
  getFollowing,
  toggleFollowing,
} from "../../controllers/followingFeatures/followerController.js";
import { validateSchema } from "../../middleware/validateSchema.js";
import validateUserToken from "../../middleware/validateUser.js";
import { followSchema } from "../../schemas/followSchemas/followerSchema.js";

const followRouter = Router();

followRouter.post(
  "/follow",
  validateUserToken,
  validateSchema(followSchema),
  toggleFollowing
);
followRouter.get("/follow", validateUserToken, getFollowing);

export default followRouter;
