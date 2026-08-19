import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {

    try {

        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated. Please login."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Your session has expired. Please login again."
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid authentication token."
        });
    }
};

export default authMiddleware;