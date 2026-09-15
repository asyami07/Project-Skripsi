import db from "../models/index.js";
// set data awal
const seed = async () => {
  // RESET
  await db.DetailLineup.destroy({ where: {} });
  await db.Lineup.destroy({ where: {} });
  await db.Nilai.destroy({ where: {} });
  await db.Pemain.destroy({ where: {} });
  await db.Kriteria.destroy({ where: {} });
  await db.Formasi.destroy({ where: {} });
  await db.Posisi.destroy({ where: {} });

  //  POSISI
  const posisi = await db.Posisi.bulkCreate([
    { nama_posisi: "GK" },
    { nama_posisi: "DF" },
    { nama_posisi: "MF" },
    { nama_posisi: "FW" },
  ]);

  const GK = posisi[0];
  const DF = posisi[1];
  const MF = posisi[2];
  const FW = posisi[3];

  //  PEMAIN
  const pemain = await db.Pemain.bulkCreate([
    { nama: "Abil", id_posisi: FW.id, status: "fit" },
    { nama: "Dika", id_posisi: FW.id, status: "fit" },
    { nama: "Farhan", id_posisi: FW.id, status: "fit" },
    { nama: "Fajar", id_posisi: MF.id, status: "fit" },
    { nama: "Mali", id_posisi: MF.id, status: "fit" },
    { nama: "Daffa", id_posisi: MF.id, status: "fit" },
    { nama: "Genta", id_posisi: DF.id, status: "cedera" },
    { nama: "Gagah", id_posisi: DF.id, status: "fit" },
    { nama: "Alung", id_posisi: DF.id, status: "fit" },
    { nama: "Nanda", id_posisi: GK.id, status: "fit" },
  ]);

  //  KRITERIA (PER POSISI)
  const kriteria = await db.Kriteria.bulkCreate([
    // GK
    { nama_kriteria: "Reflex", tipe: "benefit", bobot: 5, id_posisi: GK.id },
    {
      nama_kriteria: "Positioning",
      tipe: "benefit",
      bobot: 4,
      id_posisi: GK.id,
    },
    {
      nama_kriteria: "Shot Stopping",
      tipe: "benefit",
      bobot: 5,
      id_posisi: GK.id,
    },
    {
      nama_kriteria: "Ball Distribution",
      tipe: "benefit",
      bobot: 4,
      id_posisi: GK.id,
    },
    {
      nama_kriteria: "Concentration",
      tipe: "benefit",
      bobot: 4,
      id_posisi: GK.id,
    },

    // DF
    { nama_kriteria: "Tackling", tipe: "benefit", bobot: 5, id_posisi: DF.id },
    { nama_kriteria: "Marking", tipe: "benefit", bobot: 4, id_posisi: DF.id },
    { nama_kriteria: "Intercept", tipe: "benefit", bobot: 4, id_posisi: DF.id },
    { nama_kriteria: "Heading", tipe: "benefit", bobot: 4, id_posisi: DF.id },
    { nama_kriteria: "Stamina", tipe: "benefit", bobot: 3, id_posisi: DF.id },

    // MF
    { nama_kriteria: "Passing", tipe: "benefit", bobot: 5, id_posisi: MF.id },
    { nama_kriteria: "Vision", tipe: "benefit", bobot: 4, id_posisi: MF.id },
    {
      nama_kriteria: "Ball Control",
      tipe: "benefit",
      bobot: 5,
      id_posisi: MF.id,
    },
    { nama_kriteria: "Stamina", tipe: "benefit", bobot: 4, id_posisi: MF.id },
    {
      nama_kriteria: "Creativity",
      tipe: "benefit",
      bobot: 5,
      id_posisi: MF.id,
    },

    // FW
    { nama_kriteria: "Shooting", tipe: "benefit", bobot: 5, id_posisi: FW.id },
    { nama_kriteria: "Finishing", tipe: "benefit", bobot: 5, id_posisi: FW.id },
    {
      nama_kriteria: "Positioning",
      tipe: "benefit",
      bobot: 4,
      id_posisi: FW.id,
    },
    { nama_kriteria: "Speed", tipe: "benefit", bobot: 4, id_posisi: FW.id },
    { nama_kriteria: "Dribbling", tipe: "benefit", bobot: 5, id_posisi: FW.id },
  ]);

  //  NILAI
  const nilaiData = [];

  pemain.forEach((p) => {
    const kriteriaPosisi = kriteria.filter((k) => k.id_posisi === p.id_posisi);

    kriteriaPosisi.forEach((k) => {
      nilaiData.push({
        id_pemain: p.id,
        id_kriteria: k.id,
        nilai: Math.floor(Math.random() * 5) + 1, // 1-5 sesuai wawancara
      });
    });
  });

  await db.Nilai.bulkCreate(nilaiData);

  //  FORMASI
  await db.Formasi.create({
    nama_formasi: "4-3-3",
    jumlah_gk: 1,
    jumlah_df: 4,
    jumlah_mf: 3,
    jumlah_fw: 3,
  });

  console.log("Seeding sesuai wawancara berhasil");
};

const runSeed = async () => {
  try {
    await db.sequelize.sync({ alter: true }); // reset DB
    // force untuk hapus (drop) semua tabel di database
    await seed(); // jalankan seeding
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
runSeed();
export default seed;
