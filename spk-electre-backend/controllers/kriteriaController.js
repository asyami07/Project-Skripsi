import db from "../models/index.js";

//  GET ALL KRITERIA
export const getAllKriteria = async (req, res) => {
  try {
    // ambil semua kriteria + posisi
    const kriteria = await db.Kriteria.findAll({
      include: [
        {
          model: db.Posisi,
        },
      ],
    });

    res.json({
      message: "Data kriteria berhasil diambil",
      data: kriteria,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  GET KRITERIA BY ID
export const getKriteriaById = async (req, res) => {
  try {
    const { id } = req.params;

    const kriteria = await db.Kriteria.findByPk(id, {
      include: [
        {
          model: db.Posisi,
        },
      ],
    });

    // cek jika tidak ada
    if (!kriteria) {
      return res.status(404).json({
        message: "Kriteria tidak ditemukan",
      });
    }

    res.json({
      message: "Detail kriteria berhasil diambil",
      data: kriteria,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  GET KRITERIA BERDASARKAN POSISI
export const getKriteriaByPosisi = async (req, res) => {
  try {
    // ambil id posisi dari parameter URL
    const { id_posisi } = req.params;

    // ambil semua kriteria berdasarkan posisi
    const kriteria = await db.Kriteria.findAll({
      where: {
        id_posisi: id_posisi,
      },
    });

    // response
    res.json({
      message: "Kriteria berdasarkan posisi berhasil diambil",
      data: kriteria,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  CREATE KRITERIA
export const createKriteria = async (req, res) => {
  try {
    const { nama_kriteria, tipe, bobot, posisi } = req.body;

    const createdKriteria = [];

    for (const id_posisi of posisi) {
      // cek apakah sudah ada
      const existing = await db.Kriteria.findOne({
        where: {
          nama_kriteria,
          id_posisi,
        },
      });

      // kalau sudah ada skip
      if (existing) continue;

      // create baru
      const kriteria = await db.Kriteria.create({
        nama_kriteria,
        tipe,
        bobot,
        id_posisi,
      });

      createdKriteria.push(kriteria);
    }

    res.status(201).json({
      message: "Kriteria berhasil ditambahkan",
      data: createdKriteria,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  UPDATE KRITERIA
export const updateKriteria = async (req, res) => {
  try {
    const { id } = req.params;

    // cari data
    const kriteria = await db.Kriteria.findByPk(id);

    if (!kriteria) {
      return res.status(404).json({
        message: "Kriteria tidak ditemukan",
      });
    }

    // update data
    await kriteria.update(req.body);

    res.json({
      message: "Kriteria berhasil diupdate",
      data: kriteria,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

// DELETE KRITERIA
export const deleteKriteria = async (req, res) => {
  try {
    const { id } = req.params;

    // cari data
    const kriteria = await db.Kriteria.findByPk(id);

    if (!kriteria) {
      return res.status(404).json({
        message: "Kriteria tidak ditemukan",
      });
    }

    // hapus
    await kriteria.destroy();

    res.json({
      message: "Kriteria berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};
