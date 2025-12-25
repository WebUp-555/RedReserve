import Appointment from "../models/appointment.models.js";
import asyncHandler from "../utils/Aysnchandler.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Inventory from "../models/inventory.model.js";



export const bookDonation= asyncHandler(async (req, res) => {
    const {  appointmentDate, bloodGroup } = req.body;
    if (!appointmentDate || !bloodGroup) {
        throw new ApiError(400, "Appointment date and blood group are required");
      }
      const donation=await Appointment.create({
        donor:req.user._id,
        appointmentDate,    
        bloodGroup,
        status:"pending"
      });
        return res.status(201).json(new ApiResponse(201,donation,"Donation appointment booked successfully"));
});

export const getMyDonations= asyncHandler(async (req, res) => {
    const donations= await Appointment.find({donor:req.user._id}).sort({createdAt:-1});
    return res.status(200).json(new ApiResponse(200,donations,"My donation appointments"));
});

export const getAllDonations= asyncHandler(async (req, res) => {
    const donations= await Appointment.find().populate("donor","name email").sort({createdAt:-1});
    return res.status(200).json(new ApiResponse(200,donations,"All donation appointments"));
});

export const approveDonation = asyncHandler(async (req, res) => {
  const { donationId } = req.params;

  const donation = await Appointment.findById(donationId);
  if (!donation) {
    throw new ApiError(404, "Donation not found");
  }

  if (donation.status !== "pending") {
    throw new ApiError(400, "Donation already processed");
  }

  donation.status = "approved";
  await donation.save();

  // Increase inventory by 1 unit
  const inventory = await Inventory.findOneAndUpdate(
    { bloodGroup: donation.bloodGroup },
    { $inc: { unitsAvailable: 1 } },
    { new: true, upsert: true }
  );

  res.status(200).json(
    new ApiResponse(
      200,
      { donation, inventory },
      "Donation approved and inventory updated"
    )
  );
});

export const rejectDonation = asyncHandler(async (req, res) => {
  const { donationId } = req.params;

  const donation = await Appointment.findById(donationId);
  if (!donation) {
    throw new ApiError(404, "Donation not found");
  }

  donation.status = "rejected";
  await donation.save();

  res
    .status(200)
    .json(new ApiResponse(200, donation, "Donation rejected"));
});