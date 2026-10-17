import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    time: {
      type: Number,
      required: [true, "Solve time is required"],
    },
    scramble: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "3x3",
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound index for querying a user's logs quickly by category & date
timeLogSchema.index({ userId: 1, category: 1, createdAt: -1 });

export const TimeLog = mongoose.model("TimeLog", timeLogSchema);
export default TimeLog;
