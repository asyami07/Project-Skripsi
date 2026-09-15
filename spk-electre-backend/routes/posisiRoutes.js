import express from "express";

import { getAllPosisi } from "../controllers/posisiController.js";

import {
  verifyToken,
  isPelatihOrAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET semua posisi
router.get("/posisi", verifyToken, isPelatihOrAdmin, getAllPosisi);

export default router;
