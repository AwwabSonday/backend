import mongoose from "mongoose";

const pllSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    algorithm: {
      type: String,
      required: true,
    },
    scramble: {
      type: String,
      default: "",
    },
    group: {
      type: String,
      default: "PLL",
    },
  },
  { timestamps: true }
);

export const pll = mongoose.model("Pll", pllSchema);
export default pll;