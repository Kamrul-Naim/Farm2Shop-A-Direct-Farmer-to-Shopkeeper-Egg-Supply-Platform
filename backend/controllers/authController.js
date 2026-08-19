import farmerModel from "../models/farmer.js";
import shopkeeperModel from "../models/Shopkeeper.js";


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

export { getCurrentUser,logout };