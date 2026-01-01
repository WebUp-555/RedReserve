import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    unitsRequested: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    urgency: {
      type: String,
      enum: ["normal", "urgent", "critical"],
      default: "normal",
    },
    reason: {
      type: String,
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);
export default BloodRequest;