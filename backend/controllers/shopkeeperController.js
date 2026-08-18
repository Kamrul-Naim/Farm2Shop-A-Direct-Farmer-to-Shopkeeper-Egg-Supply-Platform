import bcrypt from "bcrypt";
import shopkeeperModel from "../models/Shopkeeper.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

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

export { registerShopkeeper };