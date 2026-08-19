import express from "express";
import { registerShopkeeper,loginShopkeeper } from "../controllers/shopkeeperController.js";
import upload from "../middlewares/multer.js";

const shopkeeperRouter = express.Router();

shopkeeperRouter.post(
    "/register",
    upload.single("profileImage"),
    registerShopkeeper
);

shopkeeperRouter.post(
    "/login",
    loginShopkeeper
);

export default shopkeeperRouter;