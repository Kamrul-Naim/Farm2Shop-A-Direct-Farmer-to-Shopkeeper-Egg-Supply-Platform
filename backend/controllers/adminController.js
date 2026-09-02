import bcrypt from "bcrypt";
import adminModel from "../models/admin.js";
import orderModel from "../models/orderModel.js";
import shopkeeperModel from "../models/shopkeeper.js";
import farmerModel from "../models/farmer.js";
import generateAdminToken from "../utils/generateAdminToken.js";

// Admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find admin
        const admin = await adminModel.findOne({
            email: email.toLowerCase()
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Check whether admin account is active
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: "This admin account is inactive."
            });
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate admin JWT
        const token = generateAdminToken(
            admin._id.toString()
        );

        // Store token in HTTP-only cookie
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Admin login successful.",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during admin login."
        });
    }
};

// Get current admin
const getCurrentAdmin = async (req, res) => {
    try {
        const admin = await adminModel
            .findById(req.admin.id)
            .select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        return res.status(200).json({
            success: true,
            admin
        });

    } catch (error) {
        console.error("Get current admin error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch current admin."
        });
    }
};


// Admin logout
const logoutAdmin = (req, res) => {
    try {
        res.clearCookie("adminToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Admin logged out successfully."
        });

    } catch (error) {
        console.error("Admin logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during admin logout."
        });
    }
};

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
    try {

        // Total orders
        const totalOrders = await orderModel.countDocuments();


        // Total shopkeepers
        const totalShopkeepers =
            await shopkeeperModel.countDocuments();


        // Total farmers
        const totalFarmers =
            await farmerModel.countDocuments();


        // Total eggs sold from completed/delivered orders
        const eggsSoldResult = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "delivered"
                }
            },
            {
                $group: {
                    _id: null,
                    totalEggsSold: {
                        $sum: "$quantity"
                    }
                }
            }
        ]);


        const totalEggsSold =
            eggsSoldResult.length > 0
                ? eggsSoldResult[0].totalEggsSold
                : 0;


        // Platform earns ৳1 per egg
        const platformEarnings = totalEggsSold * 1;


        // Recent orders
        const recentOrders = await orderModel
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("shopkeeper", "name shopName")
            .populate("farmer", "name farmName")
            .populate("category", "name");


        return res.status(200).json({
            success: true,

            stats: {
                totalOrders,
                totalShopkeepers,
                totalFarmers,
                totalEggsSold,
                platformEarnings
            },

            recentOrders
        });

    } catch (error) {

        console.error("Get dashboard stats error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics."
        });
    }
};

export { loginAdmin,
    getCurrentAdmin,
    logoutAdmin,
    getDashboardStats
 };