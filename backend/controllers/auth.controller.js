
import jwt from 'jsonwebtoken';
import User from '../models/auth.model.js';
import asyncHandler from '../utils/Aysnchandler.js';
import { ApiError } from '../utils/Apierror.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessTokenAndRefreshToken = async(userId) => {
  try{
       const user = await User.findById(userId)
      const accessToken= user.generateAccessToken()
      const refreshToken= user.generateRefreshToken()
      user.refreshToken=refreshToken
      await user.save({validateBeforeSave:false})
      return {accessToken,refreshToken}



  }catch(error){
     throw new ApiError(500,"Something went wrong while generating refresh and access tokens")
     
  }

}

export const register= asyncHandler(async (req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        throw new ApiError(400,"All fields are required")
    };
    const existingUser= await User.findOne({email});
    if(existingUser){
        throw new ApiError(409,"User with this email already exists")
    };
    const user= await User.create({
        name,
        email,
        password,
        role:"user"});
        return res.status(201).json(new ApiResponse(201,{id: user._id,name: user.name,email: user.email},"User registered successfully"));});
const loginUser = asyncHandler(async (req, res) => {
 const{username,email,password}=req.body
 
 if(!username && !email){
   throw new ApiError(400,"Username or email is required")
 }

// Build query with only provided fields
const query = {};
if (email) query.email = email;
if (username) query.name = username; // Map username to name field in database

const user = await User.findOne(query)
  if(!user){
    console.log(`❌ Login failed - User not found: ${email || username}`);
    throw new ApiError(404,"User does not exist")
  }
  
  const isPasswordValid= await user.isPasswordCorrect(password)
  if(!isPasswordValid){
    console.log(`❌ Login failed - Invalid password for email: ${email} (found user: ${user.email})`);
    throw new ApiError(401,"Invalid user password")
  }
  
  console.log(`✅ User logged in: ${user.email} (${user.role})`);

 const {accessToken, refreshToken} = await
  generateAccessTokenAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).
  select("-password -refreshToken")

  const options ={
    httpOnly:true,
    secure: true
  }
  return res
  .status(200).
  cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
        refreshToken
      },
      "User logged in successfully"
    )
  )
  })

   const logoutUser = asyncHandler(async (req, res) => {
      const userId = req.user?._id;
      if(!userId){
        throw new ApiError(401,"Unauthorized request");
      }

      await User.findByIdAndUpdate(userId,{
        $unset:{
          refreshToken:1 //this removes the refresh token from the document
        }
      },{
        new:true
      })
      const options ={
      httpOnly:true,
       secure: true
  }
      return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(
        new ApiResponse(200, {}, "User logged out successfully")
      )
  })
  
  const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
      throw new ApiError(400,"unauthorized request")
    }


  try {
    const decodedToken=jwt.verify(incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET)
  
    const user= await User.findById(decodedToken?._id)
      if(!user){
        throw new ApiError(401,"Invalid refresh token") 
      }
       if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401,"Refresh token is expired or used")
  
  }
  
  const options ={
      httpOnly:true,
      secure: true
  }
   const {accessToken, newRefreshToken} = await generateAccessTokenAndRefreshToken(user._id)
   return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken: newRefreshToken
        },
        "Access token refreshed successfully"
      )
    )
  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token"
    )
  }


  });
export {loginUser,logoutUser,refreshAccessToken};