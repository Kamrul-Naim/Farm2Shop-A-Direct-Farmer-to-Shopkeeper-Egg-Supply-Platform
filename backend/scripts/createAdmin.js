import "dotenv/config";
import bcrypt from "bcrypt";
import connectDB from "../config/mongodb.js";
import adminModel from "../models/admin.js";

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        const name = process.env.ADMIN_NAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        // Check environment variables
        if (!name || !email || !password) {
            console.error(
                "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required."
            );

            process.exit(1);
        }

        // Check if admin already exists
        const existingAdmin = await adminModel.findOne({
            email: email.toLowerCase()
        });

        if (existingAdmin) {
            console.log("Admin with this email already exists.");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const admin = await adminModel.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            isActive: true
        });

        console.log("Admin created successfully.");
        console.log("Admin ID:", admin._id);
        console.log("Admin email:", admin.email);

        process.exit(0);

    } catch (error) {
        console.error("Failed to create admin:", error);
        process.exit(1);
    }
};

createAdmin();