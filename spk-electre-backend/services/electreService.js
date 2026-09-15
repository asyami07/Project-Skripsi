//  1.BUILD MATRIX
export const buildMatrix = (pemainList) => {
  // urutkan berdasarkan id_kriteria
  const sortedNilai = [...pemainList[0].Nilais].sort(
    (a, b) => a.id_kriteria - b.id_kriteria,
  );

  // Ambil semua nama kriteria
  // ambil dari pemain pertama karena:
  // - semua pemain punya kriteria yang sama (per posisi)
  // - jadi cukup ambil 1 saja
  const kriteria = sortedNilai.map((n) => n.Kriteria.nama_kriteria);

  // Membentuk matrix keputusan
  // Matrix = array 2 dimensi
  // Baris = pemain (alternatif)
  // Kolom = kriteria
  const matrix = pemainList.map((pemain) => {
    // urutkan  pemain:
    // ambil semua nilai dari setiap kriteria
    const nilaiSorted = [...pemain.Nilais].sort(
      (a, b) => a.id_kriteria - b.id_kriteria,
    );
    return nilaiSorted.map((n) => n.nilai);
  });

  // Return hasil
  return {
    matrix, // contoh: [[4,5,3], [3,4,4]]
    kriteria, // contoh: ["Shooting", "Finishing", "Speed"]
  };
};

// 2.NORMALISASI
export const normalizeMatrix = (matrix) => {
  // jumlah kolom (kriteria)
  const colLength = matrix[0].length;

  // array untuk menyimpan pembagi tiap kolom
  const pembagi = [];

  //  HITUNG PEMBAGI (per kolom)
  for (let j = 0; j < colLength; j++) {
    let sum = 0;

    for (let i = 0; i < matrix.length; i++) {
      // jumlahkan kuadrat nilai (x^2)
      sum += Math.pow(matrix[i][j], 2);
    }

    // akar dari jumlah kuadrat
    pembagi[j] = Math.sqrt(sum);
  }

  //  NORMALISASI MATRIX
  const normalized = matrix.map((row) => {
    return row.map((value, j) => {
      // value / pembagi kolom
      return value / pembagi[j];
    });
  });

  return normalized;
};

// 3.PEMBOBOTAN
export const weightMatrix = (normalized, kriteriaList) => {
  // ambil bobot dari kriteria & urutkan kriteria berdasarkan id
  const sortedKriteria = [...kriteriaList].sort((a, b) => a.id - b.id);
  const bobot = sortedKriteria.map((k) => k.bobot);

  // kalikan setiap nilai dengan bobot
  const weighted = normalized.map((row) => {
    return row.map((value, j) => value * bobot[j]);
  });

  return weighted;
};

//  4.CONCORDANCE
export const calculateConcordance = (weightedMatrix, kriteriaList) => {
  const sortedKriteria = [...kriteriaList].sort((a, b) => a.id - b.id);

  // ambil bobot
  const bobot = sortedKriteria.map((k) => k.bobot);
  const jumlahAlternatif = weightedMatrix.length;
  // matrix concordance
  const concordanceMatrix = [];

  for (let i = 0; i < jumlahAlternatif; i++) {
    concordanceMatrix[i] = [];

    for (let j = 0; j < jumlahAlternatif; j++) {
      if (i === j) {
        concordanceMatrix[i][j] = 0;
        continue;
      }

      let total = 0;

      // bandingkan tiap kriteria
      for (let k = 0; k < weightedMatrix[i].length; k++) {
        // jika alternatif i lebih baik atau sama dari j
        if (weightedMatrix[i][k] >= weightedMatrix[j][k]) {
          total += bobot[k];
        }
      }

      concordanceMatrix[i][j] = total;
    }
  }

  return concordanceMatrix;
};

// 5.DISCORDANCE
export const calculateDiscordance = (weightedMatrix) => {
  // jumlah alternatif / pemain
  // contoh:
  // [Abil, Dika, Farhan]
  const jumlahAlternatif = weightedMatrix.length;

  // matrix untuk menampung hasil discordance
  const discordanceMatrix = [];

  // LOOP alternatif baris
  // i = pemain pembanding pertama
  for (let i = 0; i < jumlahAlternatif; i++) {
    // buat array kosong per baris
    discordanceMatrix[i] = [];

    // LOOP alternatif kolom
    // j = pemain pembanding kedua
    for (let j = 0; j < jumlahAlternatif; j++) {
      // jika pemain yang dibandingkan sama
      // contoh: Abil vs Abil
      // maka hasil = 0
      if (i === j) {
        discordanceMatrix[i][j] = 0;
        continue;
      }

      // menyimpan selisih terbesar
      // saat alternatif i kalah dari j
      let maxSelisih = 0;

      // menyimpan selisih terbesar dari semua kriteria
      let maxSemua = 0;

      // LOOP setiap kriteria
      // contoh:
      // Shooting, Speed, Dribbling
      for (let k = 0; k < weightedMatrix[i].length; k++) {
        // hitung selisih absolut
        // Math.abs (menghasilakan nilai mutlak)= agar hasil selalu positif
        const selisih = Math.abs(weightedMatrix[i][k] - weightedMatrix[j][k]);

        // =============================
        // CARI SELISIH TERBESAR GLOBAL
        // =============================
        // dipakai sebagai pembagi rumus discordance
        if (selisih > maxSemua) {
          maxSemua = selisih;
        }

        // ==========================================
        // CEK APAKAH alternatif i KALAH dari j
        // ==========================================
        // jika nilai i lebih kecil dari j
        if (weightedMatrix[i][k] < weightedMatrix[j][k]) {
          // ambil selisih terbesar saat kalah
          if (selisih > maxSelisih) {
            maxSelisih = selisih;
          }
        }
      }

      // ==================================
      // HITUNG NILAI DISCORDANCE
      // ==================================
      // rumus:
      // maxSelisih / maxSemua

      // jika maxSemua = 0
      // hindari error pembagian 0
      discordanceMatrix[i][j] = maxSemua === 0 ? 0 : maxSelisih / maxSemua;
    }
  }

  // return matrix discordance
  return discordanceMatrix;
};

// 6.THRESHOLD CONCORDANCE
export const calculateThresholdConcordance = (concordanceMatrix) => {
  let total = 0;

  let count = 0;

  for (let i = 0; i < concordanceMatrix.length; i++) {
    for (let j = 0; j < concordanceMatrix.length; j++) {
      if (i !== j) {
        total += concordanceMatrix[i][j];

        count++;
      }
    }
  }

  return total / count;
};

// 7.THRESHOLD DISCORDANCE
export const calculateThresholdDiscordance = (discordanceMatrix) => {
  let total = 0;

  let count = 0;

  for (let i = 0; i < discordanceMatrix.length; i++) {
    for (let j = 0; j < discordanceMatrix.length; j++) {
      if (i !== j) {
        total += discordanceMatrix[i][j];

        count++;
      }
    }
  }

  return total / count;
};

// 8.DOMINANCE CONCORDANCE MATRIX
// Semakin besar nilai concordance semakin baik
export const calculateDominanceConcordance = (concordanceMatrix, threshold) => {
  return concordanceMatrix.map((row, i) =>
    row.map((value, j) => {
      if (i === j) return 0;

      return value >= threshold ? 1 : 0;
    }),
  );
};

// 9.DOMINANCE DISCORDANCE MATRIX
// Semakin kecil nilai discordance semakin baik
export const calculateDominanceDiscordance = (discordanceMatrix, threshold) => {
  return discordanceMatrix.map((row, i) =>
    row.map((value, j) => {
      if (i === j) return 0;

      return value <= threshold ? 1 : 0;
    }),
  );
};
// 10.AGGREGATE DOMINANCE MATRIX
export const calculateAggregateDominance = (
  dominanceConcordance,
  dominanceDiscordance,
) => {
  return dominanceConcordance.map((row, i) =>
    row.map((value, j) => {
      if (i === j) return 0;

      return value === 1 && dominanceDiscordance[i][j] === 1 ? 1 : 0;
    }),
  );
};

// 11.RANKING ELECTRE {Hasil proses ELECTRE yang menentukan bintang dan ranking}
export const calculateRanking = (aggregateMatrix, pemainList) => {
  const ranking = [];

  for (let i = 0; i < aggregateMatrix.length; i++) {
    let skor = 0;

    for (let j = 0; j < aggregateMatrix.length; j++) {
      skor += aggregateMatrix[i][j];
    }

    ranking.push({
      id: pemainList[i].id,
      nama: pemainList[i].nama,
      skor,
    });
  }

  ranking.sort((a, b) => {
    // 1. Skor ELECTRE terbesar lebih dahulu
    if (b.skor !== a.skor) {
      return b.skor - a.skor;
    }

    // 2. Jika skor sama, gunakan ID pemain
    return a.id - b.id;
  });

  return {
    ranking,
  };
};
