import Inventory from "../models/inventory.model.js";
import  asyncHandler  from "../utils/Aysnchandler.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// ADMIN: view inventory
export const getInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find().sort({ bloodGroup: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, inventory, "Inventory list"));
});

// ADMIN: manually add/update stock
export const updateInventory = asyncHandler(async (req, res) => {
  const { bloodGroup, units } = req.body;

  if (!bloodGroup || units === undefined) {
    throw new ApiError(400, "Blood group and units required");
  }

  const inventory = await Inventory.findOneAndUpdate(
    { bloodGroup },
    { unitsAvailable: units },
    { new: true, upsert: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, inventory, "Inventory updated"));
});