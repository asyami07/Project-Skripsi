import db from "../models/index.js";
// import service ELECTRE
import {
  buildMatrix,
  normalizeMatrix,
  weightMatrix,
  calculateConcordance,
  calculateDiscordance,
  calculateThresholdConcordance,
  calculateThresholdDiscordance,
  calculateDominanceConcordance,
  calculateDominanceDiscordance,
  calculateAggregateDominance,
  calculateRanking,
} from "../services/electreService.js";

// Fungsi utama generate lineup
export const generateLineup = async (req, res) => {
  try {
    // Ambil semua posisi (GK, DF, MF, FW)
    const posisiList = await db.Posisi.findAll();

    let hasil = [];

    // LOOP PER POSISI
    for (let posisi of posisiList) {
      // AMBIL PEMAIN
      const pemain = await db.Pemain.findAll({
        where: {
          id_posisi: posisi.id,
          status: "fit", // filter pemain cedera
        },
        order: [["id", "ASC"]],
        include: [
          {
            model: db.Nilai,
            include: [
              {
                model: db.Kriteria,
                as: "Kriteria",
              },
            ],
          },
        ],
      });

      // kalau tidak ada pemain → skip
      if (pemain.length === 0) continue;

      console.log(JSON.stringify(pemain, null, 2));

      //  STEP 1 -> BUILD MATRIX
      const { matrix, kriteria } = buildMatrix(pemain);

      //  STEP 2 -> NORMALISASI
      const normalized = normalizeMatrix(matrix);

      // STEP 3 -> ambil kriteria sesuai posisi/pembobotan
      const kriteriaList = await db.Kriteria.findAll({
        where: { id_posisi: posisi.id },
      });
      const weighted = weightMatrix(normalized, kriteriaList);
      console.log("Weighted:", weighted);

      //  STEP 4 -> Concordance
      const concordance = calculateConcordance(weighted, kriteriaList);
      console.log("Concordance:", concordance);

      // STEP 5
      const discordance = calculateDiscordance(weighted);
      console.log("Discordance:", discordance);

      // STEP 6
      const thresholdConcordance = calculateThresholdConcordance(concordance);

      // STEP 7
      const thresholdDiscordance = calculateThresholdDiscordance(discordance);

      // STEP 8
      const dominanceConcordance = calculateDominanceConcordance(
        concordance,

        thresholdConcordance,
      );

      // STEP 9
      const dominanceDiscordance = calculateDominanceDiscordance(
        discordance,

        thresholdDiscordance,
      );

      // STEP 10
      const aggregateMatrix = calculateAggregateDominance(
        dominanceConcordance,

        dominanceDiscordance,
      );

      // STEP 11
      const rankingResult = calculateRanking(
        aggregateMatrix,

        pemain,
      );

      // console.log("==========================");

      // console.log("Posisi:", posisi.nama_posisi);

      // console.log("Matrix:", matrix);

      // console.log("Normalized:", normalized);

      // console.log("Weighted:", weighted);

      // console.log("Concordance:", concordance);

      // console.log("Threshold Concordance:", thresholdConcordance);

      // console.log("Discordance:", discordance);

      // console.log("Threshold Discordance:", thresholdDiscordance);

      // console.log("Dominance Concordance:", dominanceConcordance);

      // console.log("Dominance Discordance:", dominanceDiscordance);

      // console.log("Aggregate Matrix:", aggregateMatrix);

      // console.log("Ranking:", rankingResult);

      //  DEBUG
      // console.log("=================================");
      // console.log(`Posisi: ${posisi.nama_posisi}`);
      // console.log("Kriteria:", kriteria);
      // console.log("Matrix:", matrix);
      // console.log("Normalized:", normalized);

      //  TEMP HASIL
      hasil.push({
        posisi: posisi.nama_posisi,
        jumlah_pemain: pemain.length,

        // matrix keputusan awal
        matrix,

        // hasil normalisasi
        normalized,

        // hasil pembobotan
        weighted,

        // hasil concordance
        concordance,

        // hasil discordance
        discordance,

        // hasil ranking akhir ELECTRE
        ranking: rankingResult,
      });
    }

    //  GENERATE STARTING LINEUP

    // ambil formasi yang di pilih pelatih
    const { id_formasi } = req.body;

    // cari data formasi
    const formasi = await db.Formasi.findByPk(id_formasi);

    // validasi formasi
    if (!formasi) {
      return res.status(404).json({
        message: "Formasi tidak ditemukan",
      });
    }

    // object hasil lineup final
    const startingLineup = {};

    // loop hasil ranking(LECTRE) per posisi
    hasil.forEach((item) => {
      // ambil ranking ELECTRE posisi saat ini
      const pemainRank = item.ranking.ranking;

      // jumlah pemain sesuai formasi
      let jumlah = 0;

      // cek posisi
      switch (item.posisi) {
        case "GK":
          jumlah = formasi.jumlah_gk;
          break;

        case "DF":
          jumlah = formasi.jumlah_df;
          break;

        case "MF":
          jumlah = formasi.jumlah_mf;
          break;

        case "FW":
          jumlah = formasi.jumlah_fw;
          break;
      }

      // PILIH STARTER SESUAI FORMASI PELATIH
      const starter = pemainRank.slice(0, jumlah);

      // DETEKSI EQUAL QUALITY
      // Membandingkan starter terakhir
      // dengan pemain cadangan
      const lastStarter = starter[starter.length - 1];

      // cari pemain cadangan yang skornya ELECTRE sama
      const equalPlayers = pemainRank
        .slice(jumlah)
        .filter((p) => p.skor === lastStarter?.skor);
      console.log(item.posisi);

      console.log("Pemain Rank:", pemainRank);

      console.log("Starter:", starter);

      console.log("Starter terakhir:", lastStarter);

      console.log("Equal Players:", equalPlayers);

      // Simpan pemain starter sesuai formasi pelatih
      startingLineup[item.posisi] = starter.map((p) => ({
        nama: p.nama,

        // skor hasil ELECTRE
        skor: p.skor,

        posisi: item.posisi,

        // pemain masuk lineup utama
        starter: true,

        // starter tidak termasuk alternatif setara
        equal_quality: false,
      }));

      // Simpan pemain cadangan yang memiliki skor sama
      // dengan starter terakhir (Alternatif Setara)
      if (equalPlayers.length > 0) {
        startingLineup[item.posisi].push(
          ...equalPlayers.map((p) => ({
            nama: p.nama,

            // skor hasil ELECTRE
            skor: p.skor,

            posisi: item.posisi,

            // tidak masuk lineup utama
            starter: false,

            // alternatif setara
            equal_quality: true,
          })),
        );
      }
    });

    //  RESPONSE
    res.json({
      message: "Generate lineup berhasil",

      // formasi aktif
      formasi: formasi.nama_formasi,

      // hasil final starting lineup
      starting_lineup: startingLineup,

      // detail perhitungan ELECTRE
      detail: hasil,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};
