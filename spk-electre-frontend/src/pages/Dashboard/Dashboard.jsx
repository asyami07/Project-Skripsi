import { useEffect, useState } from "react";

import { Users, ClipboardList, Trophy, LayoutGrid } from "lucide-react";

import api from "../../api/axios";

import MainLayout from "../../layouts/MainLayout";

import styles from "./Dashboard.module.css";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        console.log("Dashboard Response:", response.data);
        setDashboard(response.data);
      } catch (error) {
        console.error("Error Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <h2>Loading Dashboard...</h2>
      </MainLayout>
    );
  }

  const totalPemain = dashboard?.totalPemain || 0;

  const totalNilai = dashboard?.totalNilai || 0;

  const totalKriteria = dashboard?.totalKriteria || 0;

  const totalFormasi = dashboard?.totalFormasi || 0;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>

          <p className={styles.pageSubtitle}>
            Ringkasan Sistem Pendukung Keputusan STARTS'Lineup
          </p>
        </div>
      </div>

      {/* STATISTIK */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>

          <div>
            <h3>Total Pemain</h3>

            <h2>{totalPemain}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <ClipboardList size={24} />
          </div>

          <div>
            <h3>Total Nilai</h3>

            <h2>{totalNilai}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Trophy size={24} />
          </div>

          <div>
            <h3>Total Kriteria</h3>

            <h2>{totalKriteria}</h2>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <LayoutGrid size={24} />
          </div>

          <div>
            <h3>Total Formasi</h3>

            <h2>{totalFormasi}</h2>
          </div>
        </div>
      </div>
      {/* ANALYTICS */}
      <div className={styles.analyticsGrid}>
        {/* Distribusi Posisi */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Distribusi Posisi Pemain</h3>
          </div>

          <div className={styles.positionList}>
            {dashboard?.posisi?.map((item) => {
              const jumlah = Number(item.jumlah);

              const persen = totalPemain > 0 ? (jumlah / totalPemain) * 100 : 0;

              return (
                <div key={item.nama_posisi} className={styles.positionItem}>
                  <div className={styles.positionTop}>
                    <span>{item.nama_posisi}</span>

                    <strong>{jumlah} Pemain</strong>
                  </div>

                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${persen}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Pemain */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Status Pemain</h3>
          </div>

          <div className={styles.statusGrid}>
            <div className={styles.statusSuccess}>
              <span>Pemain Fit</span>

              <h2>{dashboard?.status?.fit || 0}</h2>
            </div>

            <div className={styles.statusDanger}>
              <span>Pemain Cedera</span>

              <h2>{dashboard?.status?.cedera || 0}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* INFORMASI SISTEM */}
      <div className={styles.infoCard}>
        <h3>ℹ️ Informasi Sistem</h3>

        <p>
          STARTS'Lineup merupakan Sistem Pendukung Keputusan (SPK) untuk
          menentukan Starting Lineup sepak bola menggunakan metode ELECTRE.
        </p>

        <p>
          Sistem melakukan evaluasi pemain berdasarkan kriteria yang telah
          ditentukan, kemudian menghasilkan rekomendasi pemain terbaik sesuai
          formasi yang dipilih.
        </p>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
