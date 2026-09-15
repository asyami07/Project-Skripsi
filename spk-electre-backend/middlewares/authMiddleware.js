// Import JWT
import jwt from "jsonwebtoken";

// Secret key JWT
const SECRET_KEY = "SPK_SECRET_KEY";

//  VERIFY TOKEN
export const verifyToken = (req, res, next) => {
  try {
    // Ambil token dari header
    // format:
    // Authorization: Bearer TOKEN
    const authHeader = req.headers.authorization;

    // cek apakah token ada
    if (!authHeader) {
      return res.status(401).json({
        message: "Token tidak ditemukan",
      });
    }

    // pisahkan Bearer dan token
    const token = authHeader.split(" ")[1];

    // verifikasi token
    const decoded = jwt.verify(token, SECRET_KEY);

    // simpan data user ke request
    req.user = decoded;

    // lanjut ke endpoint berikutnya
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token tidak valid",
      error: error.message,
    });
  }
};

// ROLE ADMIN
export const isAdmin = (req, res, next) => {
  // cek role user
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Akses ditolak, hanya admin",
    });
  }

  next();
};

// ROLE PELATIH / ADMIN
export const isPelatihOrAdmin = (req, res, next) => {
  // role yang diizinkan
  if (req.user.role !== "admin" && req.user.role !== "pelatih") {
    return res.status(403).json({
      message: "Akses ditolak",
    });
  }

  next();
};
