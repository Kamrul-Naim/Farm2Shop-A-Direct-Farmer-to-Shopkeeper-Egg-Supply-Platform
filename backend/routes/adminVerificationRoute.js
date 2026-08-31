import express from "express";

import adminAuthMiddleware from "../middlewares/adminAuthMiddleware.js";

import {updateFarmerVerificationStatus,updateShopkeeperVerificationStatus} from "../controllers/adminVerificationController.js";


const adminVerificationRouter = express.Router();


// Update farmer verification status
adminVerificationRouter.patch(
    "/farmer/:farmerId",
    adminAuthMiddleware,
    updateFarmerVerificationStatus
);


// Update shopkeeper verification status
adminVerificationRouter.patch(
    "/shopkeeper/:shopkeeperId",
    adminAuthMiddleware,
    updateShopkeeperVerificationStatus
);


export default adminVerificationRouter;