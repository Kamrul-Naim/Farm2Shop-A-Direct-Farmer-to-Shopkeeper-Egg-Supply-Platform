import farmerModel from "../models/farmer.js";
import productModel from "../models/Product.js";
import orderModel from "../models/orderModel.js";

const getAllFarmersForAdmin = async (req, res) => {
    try {
        const { search, verificationStatus } = req.query;

        const query = {};

        // Search by name, email, NID, or farm name
        if (search?.trim()) {
            const searchValue = search.trim();

            query.$or = [
                {
                    name: {
                        $regex: searchValue,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: searchValue,
                        $options: "i"
                    }
                },
                {
                    nid: {
                        $regex: searchValue,
                        $options: "i"
                    }
                },
                {
                    farmName: {
                        $regex: searchValue,
                        $options: "i"
                    }
                }
            ];
        }

        // Filter by verification status
        if (verificationStatus) {
            const allowedStatuses = [
                "pending",
                "approved",
                "rejected"
            ];

            if (!allowedStatuses.includes(verificationStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid verification status."
                });
            }

            query.verificationStatus = verificationStatus;
        }

        const farmers = await farmerModel
            .find(query)
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            farmers
        });
    } catch (error) {
        console.error(
            "Get all farmers for admin error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get farmers."
        });
    }
};

const getFarmerDetails = async (req, res) => {
    try {
        const { farmerId } = req.params;

        const farmer = await farmerModel
            .findById(farmerId)
            .select("-password");

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found."
            });
        }

        // Get farmer's products
        const products = await productModel
            .find({ farmer: farmerId })
            .populate("category", "category price")
            .sort({ createdAt: -1 });

        // Get farmer's orders
        const orders = await orderModel
            .find({ farmer: farmerId })
            .populate("shopkeeper", "name email phone")
            .populate("product", "productName")
            .populate("category", "category")
            .sort({ createdAt: -1 });

        // Only delivered + paid orders count as completed sales
        const completedOrders = orders.filter(
            (order) =>
                order.orderStatus === "delivered" &&
                order.paymentStatus === "paid"
        );

        const totalEggsSold = completedOrders.reduce(
            (total, order) => total + order.quantity,
            0
        );

        // Platform earns 1 taka per sold egg
        const platformEarnings = totalEggsSold * 1;

        return res.status(200).json({
            success: true,
            farmer,
            products,
            orders,
            summary: {
                totalProducts: products.length,
                totalOrders: orders.length,
                completedOrders: completedOrders.length,
                totalEggsSold,
                platformEarnings
            }
        });
    } catch (error) {
        console.error("Get farmer details error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch farmer details."
        });
    }
};


export {
    getAllFarmersForAdmin,
    getFarmerDetails
};