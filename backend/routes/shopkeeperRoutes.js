import express from "express";
import { registerShopkeeper } from "../controllers/shopkeeperController.js";
import upload from "../middlewares/multer.js";

const shopkeeperRouter = express.Router();

shopkeeperRouter.post(
    "/register",
    upload.single("profileImage"),
    registerShopkeeper
);

export default shopkeeperRouter;