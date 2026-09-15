import express from "express";

import {
  getAllNilai,
  getNilaiByPemain,
  getNilaiById,
  createUpdateNilai,
  deleteNilai,
} from "../controllers/nilaiController.js";

import {
  verifyToken,
  isAdmin,
  isPelatihOrAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET semua nilai
router.get("/nilai", verifyToken, isPelatihOrAdmin, getAllNilai);

// GET nilai berdasarkan pemain
router.get(
  "/nilai/pemain/:id",
  verifyToken,
  isPelatihOrAdmin,
  getNilaiByPemain,
);

// GET detail nilai
router.get("/nilai/:id", verifyToken, isPelatihOrAdmin, getNilaiById);

// POST tambah nilai
router.post("/nilai", verifyToken, isPelatihOrAdmin, createUpdateNilai);

// PUT update nilai
router.put("/nilai/:id", verifyToken, isPelatihOrAdmin, createUpdateNilai);

// DELETE nilai
router.delete("/nilai/:id", verifyToken, isAdmin, deleteNilai);

export default router;
