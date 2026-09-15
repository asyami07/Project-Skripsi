import express from "express";

import {
  getAllKriteria,
  getKriteriaById,
  getKriteriaByPosisi,
  createKriteria,
  updateKriteria,
  deleteKriteria,
} from "../controllers/kriteriaController.js";

import {
  verifyToken,
  isAdmin,
  isPelatihOrAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET semua kriteria
router.get("/kriteria", verifyToken, isPelatihOrAdmin, getAllKriteria);

// GET kriteria berdasarkan posisi
router.get(
  "/kriteria/posisi/:id_posisi",
  verifyToken,
  isPelatihOrAdmin,
  getKriteriaByPosisi,
);

// GET detail kriteria
router.get("/kriteria/:id", verifyToken, isPelatihOrAdmin, getKriteriaById);

// GET

// POST tambah kriteria
router.post("/kriteria", verifyToken, isAdmin, createKriteria);

// PUT update kriteria
router.put("/kriteria/:id", verifyToken, isAdmin, updateKriteria);

// DELETE kriteria
router.delete("/kriteria/:id", verifyToken, isAdmin, deleteKriteria);

export default router;
