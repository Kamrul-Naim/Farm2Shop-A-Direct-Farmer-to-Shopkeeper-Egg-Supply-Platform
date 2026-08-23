import jwt from "jsonwebtoken";

const adminAuthMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.adminToken;

        // No admin token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Admin authentication required."
            });
        }

        // Verify admin token
        const decoded = jwt.verify(
            token,
            process.env.ADMIN_JWT_SECRET
        );

        // Make sure this is actually an admin token
        if (decoded.type !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access denied."
            });
        }

        // Store authenticated admin information
        req.admin = {
            id: decoded.id,
            type: decoded.type
        };

        next();

    } catch (error) {
        console.error("Admin authentication error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin token."
        });
    }
};

export default adminAuthMiddleware;