import db from "../models/index.js";

// GET ALL POSISI
export const getAllPosisi = async (req, res) => {
  try {
    // ambil semua posisi
    const posisi = await db.Posisi.findAll();

    // response
    res.json({
      message: "Data posisi berhasil diambil",
      data: posisi,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};
