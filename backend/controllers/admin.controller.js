import bcrypt from "bcrypt";
import User from "../models/auth.model.js";
import asyncHandler from "../utils/Aysnchandler.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const admin = await User.findOne({ email, role: "admin" });
  if (!admin) {
    console.log(`❌ Login failed - Admin not found: ${email}`);
    throw new ApiError(401, "Unauthorized");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    console.log(`❌ Login failed - Invalid password: ${email}`);
    throw new ApiError(401, "Invalid credentials");
  }

  const token = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();
  
  // Save refresh token
  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });
  
  console.log(`✅ Admin logged in: ${admin.email} (${admin.role})`);

  const options = {
    httpOnly: true,
    secure: true
  };

  res
    .status(200)
    .cookie("adminAccessToken", token, options)
    .cookie("adminRefreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          token,
          refreshToken,
          admin: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        },
        "Admin login successful"
      )
    );
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password -refreshToken");
  res.status(200).json(
    new ApiResponse(200, users, "Fetched all users successfully")
  );
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);

  if (!user || user.role !== "user") {
    throw new ApiError(404, "User not found");
  }

  await user.remove();
  res.status(200).json(
    new ApiResponse(200, null, "User deleted successfully")
  );
});
export const adminlogout=asyncHandler(async (req,res)=>{
    const admin=req.user;
    admin.refreshToken=null;
    await admin.save();
    
    const options = {
      httpOnly: true,
      secure: true
    };
    
    res
      .status(200)
      .clearCookie("adminAccessToken", options)
      .clearCookie("adminRefreshToken", options)
      .json(
        new ApiResponse(200, null, "Admin logged out successfully")
      );
});