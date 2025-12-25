import BloodRequest from "../models/requester.model.js";
import Inventory from "../models/inventory.model.js";
import  asyncHandler  from "../utils/Aysnchandler.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// USER: create blood request
export const createBloodRequest = asyncHandler(async (req, res) => {
  const { bloodGroup, units } = req.body;

  if (!bloodGroup || !units) {
    throw new ApiError(400, "Blood group and units are required");
  }

  const request = await BloodRequest.create({
    requester: req.user._id,
    bloodGroup,
    units,
    status: "pending",
  });

  res
    .status(201)
    .json(new ApiResponse(201, request, "Blood request created"));
});

// USER: view own requests
export const getMyBloodRequests = asyncHandler(async (req, res) => {
  const requests = await BloodRequest.find({
    requester: req.user._id,
  }).sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, requests, "My blood requests"));
});

// ADMIN: view all requests
export const getAllBloodRequests = asyncHandler(async (req, res) => {
  console.log("=== GET ALL BLOOD REQUESTS ENDPOINT HIT ===");
  console.log("User accessing:", req.user?.email, "Role:", req.user?.role);
  
  const requests = await BloodRequest.find()
    .populate("requester", "name email")
    .sort({ createdAt: -1 });

  console.log("Found", requests.length, "blood requests");

  res
    .status(200)
    .json(new ApiResponse(200, requests, "All blood requests"));
});

// ADMIN: approve request
export const approveBloodRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await BloodRequest.findById(requestId);
  if (!request) {
    throw new ApiError(404, "Blood request not found");
  }

  if (request.status !== "pending") {
    throw new ApiError(400, "Request already processed");
  }

  const inventory = await Inventory.findOne({
    bloodGroup: request.bloodGroup,
  });

  if (!inventory || inventory.unitsAvailable < request.units) {
    throw new ApiError(400, "Insufficient stock");
  }

  inventory.unitsAvailable -= request.units;
  await inventory.save();

  request.status = "approved";
  await request.save();

  res.status(200).json(
    new ApiResponse(
      200,
      { request, inventory },
      "Blood request approved"
    )
  );
});

// ADMIN: reject request
export const rejectBloodRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await BloodRequest.findById(requestId);
  if (!request) {
    throw new ApiError(404, "Blood request not found");
  }

  request.status = "rejected";
  await request.save();

  res
    .status(200)
    .json(new ApiResponse(200, request, "Blood request rejected"));
});