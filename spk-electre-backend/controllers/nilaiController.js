import db from "../models/index.js";

//  GET ALL NILAI
export const getAllNilai = async (req, res) => {
  try {
    // Ambil semua nilai + relasi pemain & kriteria
    const nilai = await db.Nilai.findAll({
      include: [
        {
          model: db.Pemain,
        },
        {
          model: db.Kriteria,
          as: "Kriteria",
        },
      ],
    });

    res.json({
      message: "Data nilai berhasil diambil",
      data: nilai,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

export const getNilaiByPemain = async (req, res) => {
  try {
    const { id } = req.params;

    const nilai = await db.Nilai.findAll({
      where: {
        id_pemain: id,
      },

      include: [
        {
          model: db.Kriteria,

          as: "Kriteria",
        },
      ],
    });

    res.json({
      message: "Nilai pemain berhasil diambil",

      data: nilai,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",

      error: error.message,
    });
  }
};

//  GET NILAI BY ID
export const getNilaiById = async (req, res) => {
  try {
    const { id } = req.params;

    const nilai = await db.Nilai.findByPk(id, {
      include: [
        {
          model: db.Pemain,
        },
        {
          model: db.Kriteria,
          as: "Kriteria",
        },
      ],
    });

    // cek jika tidak ditemukan
    if (!nilai) {
      return res.status(404).json({
        message: "Data nilai tidak ditemukan",
      });
    }

    res.json({
      message: "Detail nilai berhasil diambil",
      data: nilai,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  CREATE / UPDATE NILAI
export const createUpdateNilai = async (req, res) => {
  try {
    const { id_pemain, nilai_input, nilai } = req.body;

    // looping semua nilai
    for (const id_kriteria in nilai) {
      // cek apakah nilai sudah ada
      const existingNilai = await db.Nilai.findOne({
        where: {
          id_pemain: Number(id_pemain),

          id_kriteria: Number(id_kriteria),
        },
      });

      if (existingNilai) {
        // update nilai lama
        await existingNilai.update({
          // nilai asli
          nilai_input: Number(nilai_input[id_kriteria]),

          // nilai konversi
          nilai: Number(nilai[id_kriteria]),
        });
      } else {
        // create nilai baru
        await db.Nilai.create({
          id_pemain: Number(id_pemain),

          id_kriteria: Number(id_kriteria),

          // nilai asli
          nilai_input: Number(nilai_input[id_kriteria]),

          // nilai konversi
          nilai: Number(nilai[id_kriteria]),
        });
      }
    }

    res.status(201).json({
      message: "Nilai berhasil disimpan",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  DELETE NILAI
export const deleteNilai = async (req, res) => {
  try {
    const { id } = req.params;

    // cari data
    const nilai = await db.Nilai.findByPk(id);

    if (!nilai) {
      return res.status(404).json({
        message: "Data nilai tidak ditemukan",
      });
    }

    // hapus
    await nilai.destroy();

    res.json({
      message: "Nilai berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};
