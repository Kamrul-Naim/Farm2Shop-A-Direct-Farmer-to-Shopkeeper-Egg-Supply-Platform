import productModel from "../models/Product.js";
import categoryPriceModel from "../models/CategoryPrice.js";
import { uploadToCloudinary } from "../config/cloudinary.js";


// Create product
const createProduct = async (req, res) => {
    try {
        const {
            productName,
            category,
            description
        } = req.body;

        // Convert multipart/form-data values to numbers
        const quantity = Number(req.body.quantity);
        const minimumOrderQuantity = Number(
            req.body.minimumOrderQuantity
        );

        // Check required text fields
        if (
            !productName?.trim() ||
            !category ||
            !description?.trim() ||
            req.body.quantity === undefined ||
            req.body.minimumOrderQuantity === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided."
            });
        }

        // Validate quantity
        if (
            !Number.isFinite(quantity) ||
            quantity < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be a valid non-negative number."
            });
        }

        // Validate minimum order quantity
        if (
            !Number.isFinite(minimumOrderQuantity) ||
            minimumOrderQuantity < 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Minimum order quantity must be a valid number of at least 1."
            });
        }

        // Minimum order quantity cannot exceed available quantity
        if (minimumOrderQuantity > quantity) {
            return res.status(400).json({
                success: false,
                message:
                    "Minimum order quantity cannot exceed available quantity."
            });
        }

        // Find category
        const categoryData =
            await categoryPriceModel.findById(category);

        if (!categoryData) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        // Category must be active
        if (!categoryData.isActive) {
            return res.status(400).json({
                success: false,
                message:
                    "This category is currently inactive."
            });
        }

        // Check images
        if (
            !req.files ||
            req.files.length < 1 ||
            req.files.length > 3
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "A product must have between 1 and 3 images."
            });
        }

        // Upload images to Cloudinary
        const imageUrls = [];

        for (const file of req.files) {
            const result = await uploadToCloudinary(
                file.buffer,
                "products"
            );

            imageUrls.push(result.secure_url);
        }

        // Product expires after 7 days
        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        // Farmer comes from authenticated user
        const farmerId = req.user.id;

        // Create product
        const product = await productModel.create({
            productName: productName.trim(),
            category,
            description: description.trim(),
            images: imageUrls,
            quantity,
            minimumOrderQuantity,
            farmer: farmerId,
            isAvailable: true,
            expiresAt
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product
        });

    } catch (error) {
        console.error(
            "Create product error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while creating the product."
        });
    }
};


// Get available products
const getProducts = async (req, res) => {
    try {
        const products = await productModel
            .find({
                isAvailable: true,
                expiresAt: { $gt: new Date() }
            })
            .populate(
                "category",
                "category price"
            )
            .populate(
                "farmer",
                "name farmName farmAddress profileImage"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        console.error("Get products error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products."
        });
    }
};

// Get products created by the logged-in farmer
const getMyProducts = async (req, res) => {
    try {
        const farmerId = req.user.id;

        // Update expired products first
        await updateExpiredProducts();

        const products = await productModel
            .find({
                farmer: farmerId
            })
            .populate(
                "category",
                "category price"
            )
            .sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        console.error("Get my products error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch your products."
        });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await productModel
            .findById(productId)
            .populate(
                "category",
                "category price"
            )
            .populate(
                "farmer",
                "name farmName farmAddress farmDescription profileImage"
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Get product by ID error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product."
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const {
            productName,
            description,
            quantity,
            minimumOrderQuantity
        } = req.body;

        // Find product belonging to the logged-in farmer
        const product = await productModel.findOne({
            _id: productId,
            farmer: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        // Unavailable products cannot be edited
        if (!product.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Unavailable products cannot be edited."
            });
        }

        // Update product name
        if (productName !== undefined) {
            if (!productName.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Product name cannot be empty."
                });
            }

            product.productName = productName.trim();
        }

        // Update description
        if (description !== undefined) {
            if (!description.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Product description cannot be empty."
                });
            }

            product.description = description.trim();
        }

        // Update quantity
        if (quantity !== undefined) {
            const updatedQuantity = Number(quantity);

            if (
                Number.isNaN(updatedQuantity) ||
                updatedQuantity < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity cannot be negative."
                });
            }

            product.quantity = updatedQuantity;
        }

        // Update minimum order quantity
        if (minimumOrderQuantity !== undefined) {
            const updatedMinimumOrderQuantity =
                Number(minimumOrderQuantity);

            if (
                Number.isNaN(updatedMinimumOrderQuantity) ||
                updatedMinimumOrderQuantity < 1
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Minimum order quantity must be at least 1."
                });
            }

            product.minimumOrderQuantity =
                updatedMinimumOrderQuantity;
        }

        // Minimum order quantity cannot exceed available quantity
        if (
            product.minimumOrderQuantity >
            product.quantity
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Minimum order quantity cannot exceed available quantity."
            });
        }

        /*
         * Existing images that the farmer wants to keep.
         *
         * The frontend sends these as:
         *
         * existingImages: [url1, url2]
         */
        let existingImages = req.body.existingImages || [];

        // If only one existing image is sent,
        // convert it into an array.
        if (!Array.isArray(existingImages)) {
            existingImages = [existingImages];
        }

        /*
         * Upload newly added images.
         */
        const newImageUrls = [];

        if (req.files && req.files.length > 0) {

            for (const file of req.files) {

                // Prevent total images from exceeding 3
                if (
                    existingImages.length +
                    newImageUrls.length >= 3
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "A product can have a maximum of 3 images."
                    });
                }

                const result = await uploadToCloudinary(
                    file.buffer,
                    "products"
                );

                newImageUrls.push(result.secure_url);
            }
        }

        /*
         * Final image list:
         *
         * Existing images that remain
         * +
         * Newly uploaded images
         */
        const finalImages = [
            ...existingImages,
            ...newImageUrls
        ];

        // Product must always have 1–3 images
        if (finalImages.length < 1) {
            return res.status(400).json({
                success: false,
                message:
                    "A product must have at least 1 image."
            });
        }

        if (finalImages.length > 3) {
            return res.status(400).json({
                success: false,
                message:
                    "A product can have a maximum of 3 images."
            });
        }

        product.images = finalImages;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product
        });

    } catch (error) {
        console.error("Update product error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while updating the product."
        });
    }
};


// Remove product
const removeProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find the product belonging to the logged-in farmer
        const product = await productModel.findOne({
            _id: productId,
            farmer: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        // Check if already unavailable
        if (!product.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Product is already unavailable."
            });
        }

        // Do not delete the document.
        // Simply make the product unavailable.
        product.isAvailable = false;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product removed successfully."
        });

    } catch (error) {
        console.error("Remove product error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while removing the product."
        });
    }
};

// Admin removes a product
const removeProductByAdmin = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        if (!product.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Product is already unavailable."
            });
        }

        product.isAvailable = false;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product removed successfully by admin."
        });

    } catch (error) {
        console.error("Admin remove product error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while removing the product."
        });
    }
};

// Admin gets all products
const getAllProductsForAdmin = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate(
                "category",
                "category price"
            )
            .populate(
                "farmer",
                "name email phone farmName farmAddress profileImage"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        console.error(
            "Admin get all products error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products."
        });
    }
};

// Admin gets a single product
const getProductByIdForAdmin = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await productModel
            .findById(productId)
            .populate(
                "category",
                "category price"
            )
            .populate(
                "farmer",
                "name email phone farmName farmAddress farmDescription profileImage verificationStatus"
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error(
            "Admin get product by ID error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product."
        });
    }
};

const updateExpiredProducts = async () => {
    try {
        await productModel.updateMany(
            {
                expiresAt: { $lte: new Date() },
                isAvailable: true
            },
            {
                $set: { isAvailable: false }
            }
        );
    } catch (error) {
        console.error("Update expired products error:", error);
    }
};

export { createProduct, getProducts, getMyProducts, getProductById, updateProduct, removeProduct, removeProductByAdmin, getAllProductsForAdmin, getProductByIdForAdmin, updateExpiredProducts };