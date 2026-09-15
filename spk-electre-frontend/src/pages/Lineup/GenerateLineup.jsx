import { useEffect, useState } from "react";

import api from "../../api/axios";

import MainLayout from "../../layouts/MainLayout";

import Swal from "sweetalert2";

// import page from "../../styles/Page.module.css";

import styles from "../Lineup/GenerateLineup.module.css";

function GenerateLineup() {
  // formasi
  const [formasi, setFormasi] = useState([]);

  // selected formasi
  const [selectedFormasi, setSelectedFormasi] = useState("");

  // hasil lineup
  const [hasil, setHasil] = useState(null);

  // loading
  const [loading, setLoading] = useState(false);

  // fetch formasi
  const fetchFormasi = async () => {
    try {
      const response = await api.get("/formasi");

      setFormasi(response.data.data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengambil data formasi",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFormasi();
    };

    loadData();
  }, []);

  // generate lineup
  const handleGenerate = async () => {
    try {
      if (!selectedFormasi) {
        return Swal.fire({
          icon: "warning",
          title: "Pilih Formasi",
          text: "Silakan pilih formasi terlebih dahulu",
        });
      }

      setLoading(true);

      const response = await api.post("/generate-lineup", {
        id_formasi: selectedFormasi,
      });
      setHasil(response.data);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Lineup berhasil dibuat",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.message || "Gagal generate lineup",
      });
    } finally {
      setLoading(false);
    }
  };

  // Visualisasi bintang berdasarkan skor ELECTRE per posisi
  const getStars = (skor, pemainPosisi) => {
    const maxSkor = Math.max(...pemainPosisi.map((p) => p.skor));

    const rating = Math.max(1, Math.round((skor / maxSkor) * 5));

    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getPlayerStatus = (item) => {
    if (!item.starter) {
      return "Equal Quality";
    }

    return "Starter";
  };

  // if (hasil) {
  //   console.log(hasil.starting_lineup);
  // }

  return (
    <MainLayout>
      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Generate Starting Lineup</h1>

          <p className={styles.pageSubtitle}>
            Generate lineup terbaik menggunakan metode ELECTRE
          </p>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoBox}>
            <div className={styles.infoIcon}>⚖️</div>

            <div>
              <h5>Alternatif Cadangan Setara</h5>
              <p>Pemain dengan hasil ELECTRE setara.</p>
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoIcon}>🏆</div>

            <div>
              <h5>Rank ELECTRE</h5>
              <p>Hasil peringkat metode ELECTRE.</p>
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoIcon}>⭐</div>

            <div>
              <h5>Bintang</h5>
              <p>Visualisasi ranking pemain.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FORM PILIH FORMASI */}
      <div className={styles.generateCard}>
        <div className={styles.formasiContainer}>
          <label>Pilih Formasi</label>

          <select
            className={styles.formasiSelect}
            value={selectedFormasi}
            onChange={(e) => setSelectedFormasi(e.target.value)}
          >
            <option value="">-- Pilih Formasi --</option>

            {formasi.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama_formasi}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            className={styles.generateButton}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Lineup"}
          </button>
        </div>
      </div>

      {/* HASIL */}
      {hasil && (
        <div className={styles.lineupContainer}>
          {/* ================= LEFT SECTION ================= */}
          <div className={styles.leftSection}>
            {/* FOOTBALL FIELD */}
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                ⚽ Formasi {hasil.formasi}
              </div>

              {/* MARKING LAPANGAN */}
              <div className={styles.pitchBorder}>
                {/* Corner */}
                <div className={styles.cornerTopLeft}></div>

                <div className={styles.cornerTopRight}></div>

                <div className={styles.cornerBottomLeft}></div>

                <div className={styles.cornerBottomRight}></div>
              </div>

              <div className={styles.halfLine}></div>

              <div className={styles.centerCircle}></div>

              <div className={styles.centerDot}></div>

              {/* AREA ATAS */}
              <div className={styles.penaltyTop}></div>

              <div className={styles.goalBoxTop}></div>

              <div className={styles.penaltyDotTop}></div>

              <div className={styles.penaltyArcTop}></div>

              {/* AREA BAWAH */}
              <div className={styles.penaltyBottom}></div>

              <div className={styles.goalBoxBottom}></div>

              <div className={styles.penaltyDotBottom}></div>

              <div className={styles.penaltyArcBottom}></div>

              {/* ================= FORWARD ================= */}
              <div className={styles.fwRow}>
                {hasil.starting_lineup?.FW?.filter((p) => p.starter).map(
                  (item, index) => (
                    <div key={index} className={styles.playerCard}>
                      <div className={styles.playerAvatar}>
                        {item.nama?.charAt(0).toUpperCase()}
                      </div>

                      <div className={styles.playerName}>{item.nama}</div>

                      <div className={styles.playerStars}>
                        {getStars(item.skor, hasil.starting_lineup.FW)}
                      </div>
                      <div className={styles.playerScore}>
                        Skor : {item.skor}
                      </div>
                      <div className={styles.starterWrapper}>
                        <div className={styles.starterBadge}>
                          {getPlayerStatus(item)}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* ================= MIDFIELDER ================= */}
              <div className={styles.mfRow}>
                {hasil.starting_lineup?.MF?.filter((p) => p.starter).map(
                  (item, index) => (
                    <div key={index} className={styles.playerCard}>
                      <div className={styles.playerAvatar}>
                        {item.nama?.charAt(0).toUpperCase()}
                      </div>

                      <div className={styles.playerName}>{item.nama}</div>

                      <div className={styles.playerStars}>
                        {getStars(item.skor, hasil.starting_lineup.MF)}
                      </div>
                      <div className={styles.playerScore}>
                        Skor : {item.skor}
                      </div>
                      <div className={styles.starterWrapper}>
                        <div className={styles.starterBadge}>
                          {getPlayerStatus(item)}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* ================= DEFENDER ================= */}
              <div className={styles.dfRow}>
                {hasil.starting_lineup?.DF?.filter((p) => p.starter).map(
                  (item, index) => (
                    <div key={index} className={styles.playerCard}>
                      <div className={styles.playerAvatar}>
                        {item.nama?.charAt(0).toUpperCase()}
                      </div>

                      <div className={styles.playerName}>{item.nama}</div>

                      <div className={styles.playerStars}>
                        {getStars(item.skor, hasil.starting_lineup.DF)}
                      </div>
                      <div className={styles.playerScore}>
                        Skor : {item.skor}
                      </div>
                      <div className={styles.starterWrapper}>
                        <div className={styles.starterBadge}>
                          {getPlayerStatus(item)}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* ================= GOALKEEPER ================= */}
              <div className={styles.gkRow}>
                {hasil.starting_lineup?.GK?.filter((p) => p.starter).map(
                  (item, index) => (
                    <div key={index} className={styles.playerCard}>
                      <div className={styles.playerAvatar}>
                        {item.nama?.charAt(0).toUpperCase()}
                      </div>

                      <div className={styles.playerName}>{item.nama}</div>

                      <div className={styles.playerStars}>
                        {getStars(item.skor, hasil.starting_lineup.GK)}
                      </div>
                      <div className={styles.playerScore}>
                        Skor : {item.skor}
                      </div>
                      <div className={styles.starterWrapper}>
                        <div className={styles.starterBadge}>
                          {getPlayerStatus(item)}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
            {/* ================= EQUAL QUALITY ================= */}
            <div className={styles.equalQualityCard}>
              <h3>⚖️ Alternatif Cadangan Setara</h3>

              {Object.entries(hasil.starting_lineup)
                .flatMap(([posisi, pemain]) =>
                  pemain
                    .filter((p) => p.equal_quality)
                    .map((p) => ({
                      posisi,

                      pemainPosisi: pemain,

                      ...p,
                    })),
                )
                .map((item, index) => (
                  <div key={index} className={styles.equalQualityItem}>
                    <div className={styles.equalName}>
                      <b>{item.posisi}</b> - {item.nama}
                    </div>

                    <div className={styles.equalStars}>
                      {getStars(item.skor, item.pemainPosisi)}
                    </div>

                    <div className={styles.equalScore}>Skor : {item.skor}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* ================= SIDEBAR RANKING ================= */}
          <div className={styles.rankingCard}>
            <div className={styles.rankingHeader}>
              Lineup Tim SSB Metro Kukusan
            </div>

            {Object.entries(hasil.starting_lineup)
              .flatMap(([posisi, pemain]) =>
                pemain.map((item, index) => ({
                  posisi,

                  pemainPosisi: pemain,

                  ...item,

                  index,
                })),
              )
              .sort((a, b) => b.skor - a.skor)
              .map((item) => (
                <div
                  key={`${item.posisi}-${item.index}`}
                  className={styles.rankItem}
                >
                  <span className={styles.rankPos}>{item.posisi}</span>

                  <span className={styles.rankName}>{item.nama}</span>

                  <div className={styles.rankInfo}>
                    <div className={styles.rankStars}>
                      {getStars(item.skor, item.pemainPosisi)}
                    </div>
                    <div className={styles.rankScore}>Skor : {item.skor}</div>
                    {item.equal_quality && (
                      <div className={styles.equalBadge}>
                        Alternatif Cadangan Setara
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default GenerateLineup;
