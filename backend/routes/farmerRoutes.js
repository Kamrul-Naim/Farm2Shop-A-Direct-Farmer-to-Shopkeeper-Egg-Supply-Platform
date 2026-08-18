import express from "express";
import { registerFarmer } from "../controllers/farmercontroller.js";
import upload from "../middlewares/multer.js";

const farmerRouter = express.Router();

farmerRouter.post(
    "/register",
    upload.single("profileImage"),
    registerFarmer
);

export default farmerRouter;