import bcrypt from "bcrypt";
import shopkeeperModel from "../models/Shopkeeper.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import generateToken from "../utils/generateToken.js";



// Shopkeeper registration
const registerShopkeeper = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            phone,
            nid,
            shopName,
            shopAddress,
            shopDescription
        } = req.body;


        // Check required fields

        if (
            !name ||
            !email ||
            !password ||
            !phone ||
            !nid ||
            !shopName ||
            !shopAddress
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields."
            });
        }


        // Check existing email

        const existingEmail = await shopkeeperModel.findOne({
            email: email.toLowerCase()
        });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }


        // Check existing NID

        const existingNid = await shopkeeperModel.findOne({
            nid
        });

        if (existingNid) {
            return res.status(409).json({
                success: false,
                message: "An account with this NID already exists."
            });
        }


        // Hash password

        const hashedPassword = await bcrypt.hash(password, 10);


        // Upload profile image

        let profileImage = "";

        if (req.file) {
            const uploadedImage = await uploadToCloudinary(
                req.file.buffer,
                "farm2shop/shopkeepers"
            );

            profileImage = uploadedImage.secure_url;
        }


        // Create shopkeeper

        const shopkeeper = await shopkeeperModel.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            nid,
            profileImage,
            shopName,
            shopAddress,
            shopDescription: shopDescription || "",
            verificationStatus: "pending",
            isActive: true
        });


        return res.status(201).json({
            success: true,
            message: "Shopkeeper registration successful. Your account is pending verification.",
            shopkeeper: {
                id: shopkeeper._id,
                name: shopkeeper.name,
                email: shopkeeper.email,
                verificationStatus: shopkeeper.verificationStatus
            }
        });

    } catch (error) {

        console.error("Shopkeeper registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during registration."
        });
    }
};


// Shopkeeper login
const loginShopkeeper = async (req, res) => {

    try {

        const { email, password } = req.body;


        // Check required fields

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }


        // Find shopkeeper

        const shopkeeper = await shopkeeperModel.findOne({
            email: email.toLowerCase()
        });

        if (!shopkeeper) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }


        // Compare password

        const isPasswordMatch = await bcrypt.compare(
            password,
            shopkeeper.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }


        // Generate JWT

        const token = generateToken(
            shopkeeper._id.toString(),
            "shopkeeper"
        );


        // Store JWT in HTTP-only cookie

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        // Response

        return res.status(200).json({
            success: true,
            message: "Shopkeeper login successful.",
            user: {
                id: shopkeeper._id,
                name: shopkeeper.name,
                email: shopkeeper.email,
                nid:shopkeeper.nid,
                phone: shopkeeper.phone,
                profileImage: shopkeeper.profileImage,
                shopName: shopkeeper.shopName,
                verificationStatus: shopkeeper.verificationStatus
            },
            role: "shopkeeper"
        });

    } catch (error) {

        console.error("Shopkeeper login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during login."
        });
    }
};

export { registerShopkeeper,loginShopkeeper };