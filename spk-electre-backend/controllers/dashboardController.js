import db from "../models/index.js";

export const getDashboard = async (req, res) => {
  try {
    const totalPemain = await db.Pemain.count();

    const totalNilai = await db.Nilai.count();

    const totalKriteria = await db.Kriteria.count();

    const totalFormasi = await db.Formasi.count();

    const pemainFit = await db.Pemain.count({
      where: {
        status: "fit",
      },
    });

    const pemainCedera = await db.Pemain.count({
      where: {
        status: "cedera",
      },
    });

    const posisi = await db.Posisi.findAll({
      include: [
        {
          model: db.Pemain,
          attributes: [],
        },
      ],
      attributes: [
        "nama_posisi",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("Pemains.id")), "jumlah"],
      ],
      group: ["Posisi.id"],
    });

    res.json({
      totalPemain,
      totalNilai,
      totalKriteria,
      totalFormasi,

      status: {
        fit: pemainFit,
        cedera: pemainCedera,
      },

      posisi,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
