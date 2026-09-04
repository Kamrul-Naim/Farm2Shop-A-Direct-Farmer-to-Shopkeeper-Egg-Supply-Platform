import shopkeeperModel from "../models/shopkeeper.js";
import orderModel from "../models/orderModel.js"

// Get all shopkeepers for admin
const getAllShopkeepersForAdmin = async (req, res) => {
    try {
        const { search, verificationStatus } = req.query;

        const query = {};

        // Search by name, email, or NID
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

            if (
                !allowedStatuses.includes(
                    verificationStatus
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid verification status."
                });
            }

            query.verificationStatus =
                verificationStatus;
        }

        const shopkeepers = await shopkeeperModel
            .find(query)
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            shopkeepers
        });

    } catch (error) {
        console.error(
            "Get all shopkeepers for admin error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get shopkeepers."
        });
    }
};



const getShopkeeperDetailsForAdmin = async (req, res) => {
    try {
      const { shopkeeperId } = req.params;

      const shopkeeper = await shopkeeperModel
        .findById(shopkeeperId)
        .select("-password");

      if (!shopkeeper) {
        return res.status(404).json({
          success: false,
          message: "Shopkeeper not found.",
        });
      }

      const orders = await orderModel
        .find({
          shopkeeper: shopkeeperId,
        })
        .populate("product", "productName images")
        .populate("farmer", "name")
        .populate("category", "category price")
        .sort({ createdAt: -1 });

      // Delivered + Paid → counted as purchased eggs.
      const totalEggsPurchased = orders
        .filter(
          (order) =>
            order.orderStatus === "delivered" && order.paymentStatus === "paid",
        )
        .reduce((total, order) => total + order.quantity, 0);

      return res.status(200).json({
        success: true,
        shopkeeper,
        orders,
        totalEggsPurchased,
      });
    } catch (error) {
        console.error(
            "Get shopkeeper details for admin error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get shopkeeper details."
        });
    }
};

export {
    getAllShopkeepersForAdmin,
    getShopkeeperDetailsForAdmin
};