import mongoose from "mongoose";

const pllSchema = new mongoose.Schema({
    
},{timestamps: true});

export const pll = mongoose.model("Pll", pllSchema);