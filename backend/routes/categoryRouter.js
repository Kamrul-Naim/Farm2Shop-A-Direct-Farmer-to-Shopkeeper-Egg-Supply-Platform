import express from "express";

import { getCategories } from "../controllers/categoryPriceController.js";

const categoryRouter = express.Router();

// Get all categories
categoryRouter.get(
    "/",
    getCategories
);

export default categoryRouter;