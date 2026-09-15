import express from "express";

import {
  getAllPemain,
  getPemainById,
  createPemain,
  updatePemain,
  deletePemain,
} from "../controllers/pemainController.js";

import {
  verifyToken,
  isAdmin,
  isPelatihOrAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET semua pemain
router.get("/pemain", verifyToken, isPelatihOrAdmin, getAllPemain);

// GET detail pemain
router.get("/pemain/:id", verifyToken, isPelatihOrAdmin, getPemainById);

// POST tambah pemain
router.post("/pemain", verifyToken, isAdmin, createPemain);

// PUT update pemain
router.put("/pemain/:id", verifyToken, isAdmin, updatePemain);

// DELETE pemain
router.delete("/pemain/:id", verifyToken, isAdmin, deletePemain);

export default router;
