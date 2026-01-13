import mongoose from "mongoose";

const aiQuerySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // allow guest users
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "ELIGIBILITY",
        "DONATION_INFO",
        "REQUEST_HELP",
        "SYSTEM_FAQ",
        "OTHER",
      ],
      default: "OTHER",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AIQuery", aiQuerySchema);