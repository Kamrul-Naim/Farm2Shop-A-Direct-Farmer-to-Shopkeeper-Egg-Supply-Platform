import jwt from "jsonwebtoken";

const generateAdminToken = (adminId) => {
    return jwt.sign(
        {
            id: adminId,
            type: "admin"
        },
        process.env.ADMIN_JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

export default generateAdminToken;