import farmerModel from "../models/farmer.js";
import shopkeeperModel from "../models/Shopkeeper.js";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { uploadToCloudinary } from "../config/cloudinary.js";


// Update current user's profile
const updateProfile = async (req, res) => {
    try {

        const { id, role } = req.user;

        let user;
        const updatedFields = {};

        // Farmer
        if (role === "farmer") {

            if (req.body.farmDescription !== undefined) {
                updatedFields.farmDescription =
                    req.body.farmDescription;
            }

        }

        // Shopkeeper
        else if (role === "shopkeeper") {

            if (req.body.shopDescription !== undefined) {
                updatedFields.shopDescription =
                    req.body.shopDescription;
            }

        }

        else {
            return res.status(400).json({
                success: false,
                message: "Invalid user role."
            });
        }


        // Profile image
        if (req.file) {

            const result = await uploadToCloudinary(
                req.file.buffer,
                "profile_images"
            );

            updatedFields.profileImage = result.secure_url;
        }


        // Nothing to update
        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid profile changes provided."
            });
        }


        // Update farmer
        if (role === "farmer") {

            user = await farmerModel
                .findByIdAndUpdate(
                    id,
                    { $set: updatedFields },
                    {
                        new: true,
                        runValidators: true
                    }
                )
                .select("-password");

        }


        // Update shopkeeper
        else {

            user = await shopkeeperModel
                .findByIdAndUpdate(
                    id,
                    { $set: updatedFields },
                    {
                        new: true,
                        runValidators: true
                    }
                )
                .select("-password");
        }


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }


        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user
        });

    } catch (error) {

        console.error("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update profile."
        });
    }
};


// User logout
const logout = (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });

    } catch (error) {

        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during logout."
        });
    }
};

//Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const { id, role } = req.user;

    let user;

    if (role === "farmer") {
      user = await farmerModel.findById(id).select("-password");
    } else if (role === "shopkeeper") {
      user = await shopkeeperModel.findById(id).select("-password");
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
      role,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch current user.",
    });
  }
};

export { getCurrentUser,logout,updateProfile };