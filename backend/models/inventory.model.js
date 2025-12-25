import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    bloodGroup: {
      type: String,
      unique: true,
      required: true,
    },
    unitsAvailable: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;