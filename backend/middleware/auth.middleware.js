import jwt from "jsonwebtoken";
import asyncHandler from "../utils/Aysnchandler.js";
import User from "../models/auth.model.js";
import { ApiError } from "../utils/Apierror.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const authHeader = req.headers.authorization;
  
  const token =
    authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  next();
});

export const isAdmin = asyncHandler(async (req, _, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden access");
  }
  next();
});
