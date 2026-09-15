import express from "express";
import { generateLineup } from "../controllers/lineupController.js";
import {
  verifyToken,
  isAdmin,
  isPelatihOrAdmin,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

// endpoint generate lineup
router.post("/generate-lineup", verifyToken, isPelatihOrAdmin, generateLineup);

export default router;
