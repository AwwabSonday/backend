import express from "express";
import {
  getTimes,
  saveTime,
  deleteTime,
  resetTimes,
} from "../controllers/times.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // All times routes require authentication

router.get("/", getTimes);
router.post("/", saveTime);
router.delete("/reset", resetTimes);
router.delete("/:id", deleteTime);

export default router;
