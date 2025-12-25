import jwt from "jsonwebtoken";
import asyncHandler from "../utils/Aysnchandler.js";
import User from "../models/auth.model.js";
import { ApiError } from "../utils/Apierror.js";


export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Prefer Authorization header over cookies to avoid stale user tokens
        const tokenFromHeader = req.header("Authorization")?.replace("Bearer ", "")
        const token = tokenFromHeader || req.cookies?.accessToken
        console.log("Token received (first 50 chars):", token?.substring(0, 50));
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        console.log("Decoded token payload:", decodedToken);
          const user = await User.findById(decodedToken._id).select("-password -refreshToken")
          console.log("User from DB:", user);
          if(!user){
            
              throw new ApiError(401,"Invalid Access Token")
          }
          req.user = user
          next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }
})

export const isAdmin= asyncHandler(async (req,_,next)=>{
    console.log("Checking admin - User role:", req.user?.role, "User object:", req.user);
    if(req.user?.role !=="admin"){
        throw new ApiError(403,"Forbidden Access")
    }
    next()
})