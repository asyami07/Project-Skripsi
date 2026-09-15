import express from "express";

import {
  getAllFormasi,
  getFormasiById,
  createFormasi,
  updateFormasi,
  deleteFormasi,
} from "../controllers/formasiController.js";

import {
  verifyToken,
  isAdmin,
  isPelatihOrAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET semua formasi
router.get("/formasi", verifyToken, isPelatihOrAdmin, getAllFormasi);

// GET detail formasi
router.get("/formasi/:id", verifyToken, isPelatihOrAdmin, getFormasiById);

// POST formasi
router.post("/formasi", verifyToken, isAdmin, createFormasi);

// PUT formasi
router.put("/formasi/:id", verifyToken, isAdmin, updateFormasi);

// DELETE formasi
router.delete("/formasi/:id", verifyToken, isAdmin, deleteFormasi);

export default router;
