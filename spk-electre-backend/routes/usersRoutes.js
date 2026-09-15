import express from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// semua route users hanya admin
router.get("/users", verifyToken, isAdmin, getAllUsers);

router.get("/users/:id", verifyToken, isAdmin, getUserById);

router.post("/users", verifyToken, isAdmin, createUser);

router.put("/users/:id", verifyToken, isAdmin, updateUser);

router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

export default router;
