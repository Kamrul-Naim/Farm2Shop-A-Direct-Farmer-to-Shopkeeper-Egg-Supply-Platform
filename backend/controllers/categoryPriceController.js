import categoryPriceModel from "../models/CategoryPrice.js";

// Create a new category with price
const createCategoryPrice = async (req, res) => {
    try {
        const { category, price } = req.body;

        // Validate required fields
        if (!category || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Category and price are required."
            });
        }

        // Validate price
        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative."
            });
        }

        // Check if category already exists
        const existingCategory = await categoryPriceModel.findOne({
            category: category.trim()
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "This category already exists."
            });
        }

        // Create category
        const newCategory = await categoryPriceModel.create({
            category: category.trim(),
            price
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category: newCategory
        });

    } catch (error) {
        console.error("Create category error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the category."
        });
    }
};


// Update category price
const updateCategoryPrice = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { price } = req.body;

        // Check price
        if (price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Price is required."
            });
        }

        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative."
            });
        }

        // Find category
        const category = await categoryPriceModel.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        // Update price
        category.price = price;

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category price updated successfully.",
            category
        });

    } catch (error) {
        console.error("Update category price error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the category price."
        });
    }
};


// Activate / deactivate category
const toggleCategoryStatus = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await categoryPriceModel.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        category.isActive = !category.isActive;

        await category.save();

        return res.status(200).json({
            success: true,
            message: category.isActive
                ? "Category activated successfully."
                : "Category deactivated successfully.",
            category
        });

    } catch (error) {
        console.error("Toggle category status error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating category status."
        });
    }
};


// Get all active categories
const getActiveCategories = async (req, res) => {
    try {
        const categories = await categoryPriceModel
            .find({ isActive: true })
            .sort({ category: 1 });

        return res.status(200).json({
            success: true,
            categories
        });

    } catch (error) {
        console.error("Get active categories error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories."
        });
    }
};

// Get all categories for Admin
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryPriceModel
            .find({})
            .sort({ category: 1 });

        return res.status(200).json({
            success: true,
            categories
        });

    } catch (error) {
        console.error("Get all categories error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories."
        });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await categoryPriceModel
            .find({})
            .sort({ category: 1 });

        return res.status(200).json({
            success: true,
            categories
        });

    } catch (error) {
        console.error("Get categories error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories."
        });
    }
};


export {
    createCategoryPrice,
    updateCategoryPrice,
    toggleCategoryStatus,
    getActiveCategories,
    getAllCategories,
    getCategories
};