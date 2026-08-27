import authMiddleware from "./authMiddleware.js";

const farmerAuthMiddleware = (req, res, next) => {
    authMiddleware(req, res, () => {

        if (req.user.role !== "farmer") {
            return res.status(403).json({
                success: false,
                message: "Only farmers can perform this action."
            });
        }

        next();
    });
};

export default farmerAuthMiddleware;