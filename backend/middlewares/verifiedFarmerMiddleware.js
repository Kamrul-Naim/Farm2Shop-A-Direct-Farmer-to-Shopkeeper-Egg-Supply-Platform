import farmerModel from "../models/farmer.js"

const verifiedFarmerMiddleware = async (req, res, next) => {
    try {
        const farmer = await farmerModel.findById(req.user.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found."
            });
        }

        if (farmer.verificationStatus !== "approved") {
            return res.status(403).json({
                success: false,
                message: "Only verified farmers can perform this action."
            });
        }

        if (!farmer.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your farmer account is currently inactive."
            });
        }

        next();

    } catch (error) {
        console.error(
            "Verified farmer middleware error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to verify farmer status."
        });
    }
};

export default verifiedFarmerMiddleware;