import bcrypt from "bcrypt";
import User from "../models/auth.model.js";
import asyncHandler from "../utils/Aysnchandler.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const adminLogin = asyncHandler(async (req, res) => {
  console.log("=== ADMIN LOGIN ENDPOINT HIT ===");
  const { email, password } = req.body;
  console.log("Login attempt for:", email);

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const admin = await User.findOne({ email, role: "admin" });
  console.log("Admin found:", admin ? `Yes - ${admin.email}` : "No");
  if (!admin) {
    throw new ApiError(401, "Unauthorized");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = admin.generateAccessToken();
  console.log("Generated admin token for:", admin.email, "with role:", admin.role);
  console.log("Token (first 50 chars):", token.substring(0, 50));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
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