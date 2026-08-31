import farmerModel from "../models/farmer.js";
import shopkeeperModel from "../models/shopkeeper.js";
import createNotification from "../utils/createNotification.js";

// Update farmer verification status
const updateFarmerVerificationStatus = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const { verificationStatus } = req.body;

        // Validate status
        if (
            !["pending", "approved", "rejected"].includes(
                verificationStatus
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification status."
            });
        }

        // Find farmer
        const farmer = await farmerModel.findById(farmerId);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found."
            });
        }

        const previousStatus = farmer.verificationStatus;

        // Update verification status
        farmer.verificationStatus = verificationStatus;

        await farmer.save();

        if (previousStatus !== verificationStatus) {
          await createNotification({
            recipient: farmer._id,
            recipientRole: "farmer",
            title: "Verification Status Updated",
            message:
              verificationStatus === "approved"
                ? "Your farmer account has been verified successfully."
                : verificationStatus === "rejected"
                  ? "Your farmer verification has been rejected."
                  : "Your farmer verification is pending.",
          });
        }

        return res.status(200).json({
            success: true,
            message: "Farmer verification status updated successfully.",
            farmer
        });

    } catch (error) {
        console.error(
            "Update farmer verification status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update farmer verification status."
        });
    }
};


// Update shopkeeper verification status
const updateShopkeeperVerificationStatus = async (req, res) => {
    try {
        const { shopkeeperId } = req.params;
        const { verificationStatus } = req.body;

        // Validate status
        if (
            !["pending", "approved", "rejected"].includes(
                verificationStatus
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification status."
            });
        }

        // Find shopkeeper
        const shopkeeper = await shopkeeperModel.findById(
            shopkeeperId
        );

        if (!shopkeeper) {
            return res.status(404).json({
                success: false,
                message: "Shopkeeper not found."
            });
        }

        const previousStatus = shopkeeper.verificationStatus;
        // Update verification status
        shopkeeper.verificationStatus = verificationStatus;

        await shopkeeper.save();

        if (previousStatus !== verificationStatus) {
          await createNotification({
            recipient: shopkeeper._id,
            recipientRole: "shopkeeper",
            title: "Verification Status Updated",
            message:
              verificationStatus === "approved"
                ? "Your shopkeeper account has been verified successfully."
                : verificationStatus === "rejected"
                  ? "Your shopkeeper verification has been rejected."
                  : "Your shopkeeper verification is pending.",
          });
        }

        return res.status(200).json({
            success: true,
            message:
                "Shopkeeper verification status updated successfully.",
            shopkeeper
        });

    } catch (error) {
        console.error(
            "Update shopkeeper verification status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update shopkeeper verification status."
        });
    }
};


export {
    updateFarmerVerificationStatus,
    updateShopkeeperVerificationStatus
};