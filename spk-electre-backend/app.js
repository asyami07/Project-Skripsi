// Import framework Express untuk membuat server
import express from "express";

// Import middleware CORS (agar bisa diakses dari frontend React nanti)
import cors from "cors";

// Import koneksi database (Sequelize instance)
import sequelize from "./config/database.js";

// Import semua model + relasi
import db from "./models/index.js";

import lineupRoutes from "./routes/lineupRoutes.js";

import pemainRoutes from "./routes/pemainRoutes.js";

import nilaiRoutes from "./routes/nilaiRoutes.js";

import kriteriaRoutes from "./routes/kriteriaRoutes.js";

import authRoutes from "./routes/authRoutes.js";

import formasiRoutes from "./routes/formasiRoutes.js";

import usersRoutes from "./routes/usersRoutes.js";

import posisiRoutes from "./routes/posisiRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";

// Inisialisasi aplikasi Express
const app = express();

// Mengaktifkan CORS (biar tidak error saat connect React)
app.use(cors());

// Agar server bisa menerima data JSON dari request
app.use(express.json());

app.use(
  "/api",
  lineupRoutes,
  pemainRoutes,
  nilaiRoutes,
  kriteriaRoutes,
  authRoutes,
  formasiRoutes,
  usersRoutes,
  posisiRoutes,
  dashboardRoutes,
);

//  FUNGSI INIT DATABASE
const initDB = async () => {
  try {
    // Mengecek apakah koneksi ke database berhasil
    await sequelize.authenticate();
    console.log("Database connected ");

    // Sinkronisasi model ke database
    // ini yang membuat tabel otomatis di PostgreSQL
    await db.sequelize.sync({
      alter: true,
    });
    console.log("Database synced ");
  } catch (error) {
    // Jika ada error koneksi atau sync
    console.error("Error:", error);
  }
};

// Jalankan fungsi init database
initDB();

// Export app supaya bisa dipakai di server.js
export default app;
