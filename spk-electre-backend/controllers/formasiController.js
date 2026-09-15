import db from "../models/index.js";

//  GET ALL FORMASI
export const getAllFormasi = async (req, res) => {
  try {
    // ambil semua formasi
    const formasi = await db.Formasi.findAll();

    res.json({
      message: "Data formasi berhasil diambil",
      data: formasi,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  GET FORMASI BY ID
export const getFormasiById = async (req, res) => {
  try {
    const { id } = req.params;

    // cari formasi berdasarkan id
    const formasi = await db.Formasi.findByPk(id);

    // jika tidak ditemukan
    if (!formasi) {
      return res.status(404).json({
        message: "Formasi tidak ditemukan",
      });
    }

    res.json({
      message: "Detail formasi berhasil diambil",
      data: formasi,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  CREATE FORMASI
export const createFormasi = async (req, res) => {
  try {
    const { nama_formasi, jumlah_gk, jumlah_df, jumlah_mf, jumlah_fw } =
      req.body;

    // validasi total pemain
    const total =
      Number(jumlah_gk) +
      Number(jumlah_df) +
      Number(jumlah_mf) +
      Number(jumlah_fw);

    // harus 1 kiper
    if (Number(jumlah_gk) !== 1) {
      return res.status(400).json({
        message: "Jumlah Goalkeeper harus 1",
      });
    }

    // sepak bola harus 11 pemain
    if (total !== 11) {
      return res.status(400).json({
        message: "Total pemain harus 11",
      });
    }

    // simpan formasi
    const formasi = await db.Formasi.create({
      nama_formasi,
      jumlah_gk,
      jumlah_df,
      jumlah_mf,
      jumlah_fw,
    });

    res.status(201).json({
      message: "Formasi berhasil ditambahkan",
      data: formasi,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  UPDATE FORMASI
export const updateFormasi = async (req, res) => {
  try {
    const { id } = req.params;

    // cari formasi
    const formasi = await db.Formasi.findByPk(id);

    if (!formasi) {
      return res.status(404).json({
        message: "Formasi tidak ditemukan",
      });
    }

    const { jumlah_gk, jumlah_df, jumlah_mf, jumlah_fw } = req.body;

    // validasi total pemain
    const total = jumlah_gk + jumlah_df + jumlah_mf + jumlah_fw;

    if (total !== 11) {
      return res.status(400).json({
        message: "Total pemain harus 11",
      });
    }

    // update formasi
    await formasi.update(req.body);

    res.json({
      message: "Formasi berhasil diupdate",
      data: formasi,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  DELETE FORMASI
export const deleteFormasi = async (req, res) => {
  try {
    const { id } = req.params;

    // cari formasi
    const formasi = await db.Formasi.findByPk(id);

    if (!formasi) {
      return res.status(404).json({
        message: "Formasi tidak ditemukan",
      });
    }

    // hapus
    await formasi.destroy();

    res.json({
      message: "Formasi berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};
