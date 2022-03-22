import { Router } from "express";
import { signUp } from "../controllers/signUp";

const signUpRouter = Router();
signUpRouter.post("/sign-up", signUp);
