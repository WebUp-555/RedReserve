import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
import { ApiError } from "../utils/Apierror.js";

const verifyJWT = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(401, err?.message || "Invalid access token"));
  }
};

export { verifyJWT };
