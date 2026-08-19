// import bcrypt from "bcryptjs";
import bcrypt from 'bcrypt'
import farmerModel from '../models/farmer.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import generateToken from '../utils/generateToken.js';



// Farmer Register
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

// Farmer Login

const loginFarmer = async (req, res) => {

    try {

        const { email, password } = req.body;


        // Check required fields

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }


        // Find farmer

        const farmer = await farmerModel.findOne({
            email: email.toLowerCase()
        });

        if (!farmer) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }


        // Compare password

        const isPasswordMatch = await bcrypt.compare(
            password,
            farmer.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }


        // Generate JWT

        const token = generateToken(
            farmer._id.toString(),
            "farmer"
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
            message: "Farmer login successful.",
            farmer: {
                id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                phone: farmer.phone,
                profileImage: farmer.profileImage,
                farmName: farmer.farmName,
                verificationStatus: farmer.verificationStatus
            }
        });

    } catch (error) {

        console.error("Farmer login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during login."
        });
    }
};

export { 
    registerFarmer,
    loginFarmer, 
};