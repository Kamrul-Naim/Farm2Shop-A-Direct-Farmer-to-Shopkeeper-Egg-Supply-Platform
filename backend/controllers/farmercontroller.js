// import bcrypt from "bcryptjs";
import bcrypt from 'bcrypt'
import farmerModel from '../models/farmer.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const registerFarmer = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone,
            nid,
            farmName,
            farmAddress,
            farmDescription
        } = req.body;


        // Check required fields

        if (
            !name ||
            !email ||
            !password ||
            !phone ||
            !nid ||
            !farmName ||
            !farmAddress
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields."
            });
        }


        // Check whether email already exists

        const existingEmail = await farmerModel.findOne({
            email: email.toLowerCase()
        });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }


        // Check whether NID already exists

        const existingNid = await farmerModel.findOne({
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


        // Upload profile image if provided

        let profileImage = "";

        if (req.file) {

            const uploadedImage = await uploadToCloudinary(
                req.file.buffer,
                "farm2shop/farmers"
            );

            profileImage = uploadedImage.secure_url;
        }


        // Create farmer

        const farmer = await farmerModel.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            nid,
            profileImage,
            farmName,
            farmAddress,
            farmDescription: farmDescription || "",
            verificationStatus: "pending",
            isActive: true
        });


        return res.status(201).json({
            success: true,
            message: "Farmer registration successful. Your account is pending verification.",
            farmer: {
                id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                verificationStatus: farmer.verificationStatus
            }
        });

    } catch (error) {

        console.error("Farmer registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during registration."
        });
    }
};

export { registerFarmer };