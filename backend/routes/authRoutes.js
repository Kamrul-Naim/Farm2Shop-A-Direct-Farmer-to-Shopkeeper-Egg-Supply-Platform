import express from "express";
import {logout,getCurrentUser} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/logout", logout);
authRouter.get(
  "/me",
  authMiddleware,
  getCurrentUser
);

export default authRouter;