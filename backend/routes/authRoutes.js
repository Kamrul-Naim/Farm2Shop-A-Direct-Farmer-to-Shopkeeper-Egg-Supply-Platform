import express from "express";
import logout from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/logout", logout);

export default authRouter;