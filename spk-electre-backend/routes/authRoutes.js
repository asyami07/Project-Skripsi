// Import express
import express from "express";

// Import controller auth
import { register, login } from "../controllers/authController.js";

// Membuat router express
const router = express.Router();

//  REGISTER
// Endpoint register user baru
// POST /api/register
router.post("/register", register);

//  LOGIN
// Endpoint login user
// POST /api/login
router.post("/login", login);

// Export router
export default router;
