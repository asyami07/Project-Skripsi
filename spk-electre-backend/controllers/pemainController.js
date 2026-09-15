// Import database/model
import db from "../models/index.js";

//  GET ALL PEMAIN
export const getAllPemain = async (req, res) => {
  try {
    // Ambil semua pemain + relasi posisi
    const pemain = await db.Pemain.findAll({
      include: [
        {
          model: db.Posisi,
        },
      ],
    });

    // Kirim response
    res.json({
      message: "Data pemain berhasil diambil",
      data: pemain,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  GET DETAIL PEMAIN
export const getPemainById = async (req, res) => {
  try {
    // Ambil id dari parameter URL
    const { id } = req.params;

    // Cari pemain berdasarkan id
    const pemain = await db.Pemain.findByPk(id, {
      include: [
        {
          model: db.Posisi,
        },
      ],
    });

    // Jika pemain tidak ditemukan
    if (!pemain) {
      return res.status(404).json({
        message: "Pemain tidak ditemukan",
      });
    }

    // Kirim response
    res.json({
      message: "Detail pemain berhasil diambil",
      data: pemain,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  TAMBAH PEMAIN
export const createPemain = async (req, res) => {
  try {
    // Ambil data dari body request
    const { nama, id_posisi, status } = req.body;

    // Simpan ke database
    const pemain = await db.Pemain.create({
      nama,
      id_posisi,
      status,
    });

    // Response berhasil
    res.status(201).json({
      message: "Pemain berhasil ditambahkan",
      data: pemain,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  UPDATE PEMAIN
export const updatePemain = async (req, res) => {
  try {
    // Ambil id dari URL
    const { id } = req.params;

    // Cari pemain
    const pemain = await db.Pemain.findByPk(id);

    // Jika tidak ditemukan
    if (!pemain) {
      return res.status(404).json({
        message: "Pemain tidak ditemukan",
      });
    }

    // Update data
    await pemain.update(req.body);

    // Response
    res.json({
      message: "Pemain berhasil diupdate",
      data: pemain,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  DELETE PEMAIN
export const deletePemain = async (req, res) => {
  try {
    // Ambil id dari URL
    const { id } = req.params;

    // Cari pemain
    const pemain = await db.Pemain.findByPk(id);

    // Jika tidak ada
    if (!pemain) {
      return res.status(404).json({
        message: "Pemain tidak ditemukan",
      });
    }

    // Hapus pemain
    await pemain.destroy();

    // Response
    res.json({
      message: "Pemain berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};
