import express from "express";
import { registerFarmer,loginFarmer } from "../controllers/farmercontroller.js";
import upload from "../middlewares/multer.js";

const farmerRouter = express.Router();

farmerRouter.post(
    "/register",
    upload.single("profileImage"),
    registerFarmer
);

farmerRouter.post(
    "/login",
    loginFarmer
);

export default farmerRouter;