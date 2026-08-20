import express from "express";
import {logout,getCurrentUser,updateProfile} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const authRouter = express.Router();

authRouter.post("/logout", logout);

authRouter.get(
  "/me",
  authMiddleware,
  getCurrentUser
);

authRouter.patch(
    "/profile",
    authMiddleware,
    upload.single("profileImage"),
    updateProfile
);

export default authRouter;