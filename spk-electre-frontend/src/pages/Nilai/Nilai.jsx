import MainLayout from "../../layouts/MainLayout";

import { useEffect, useState } from "react";

import api from "../../api/axios";

// STYLE
import page from "../../styles/Page.module.css";

import { ClipboardPenLine } from "lucide-react";

import Swal from "sweetalert2";

import { Settings2 } from "lucide-react";

function Nilai() {
  //  STATE

  const [pemain, setPemain] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [kriteria, setKriteria] = useState([]);

  const [selectedPemain, setSelectedPemain] = useState(null);

  const [nilaiForm, setNilaiForm] = useState({});

  // SEARCH
  const [search, setSearch] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // FILTER
  const filteredPemain = pemain.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.Posisi?.nama_posisi?.toLowerCase().includes(search.toLowerCase()),
  );

  // PAGINATION

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredPemain.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPemain.length / itemsPerPage);

  //  FETCH PEMAIN
  const fetchPemain = async () => {
    try {
      setLoading(true);

      // request API
      const response = await api.get("/pemain");

      // simpan data
      setPemain(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //  LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      await fetchPemain();
    };

    loadData();
  }, []);

  //  pencarian data
  // const handleSearchChange = (e) => {
  //   setSearch(e.target.value);
  //   setCurrentPage(1);
  // };

  const fetchKriteria = async (id_posisi) => {
    try {
      const response = await api.get(`/kriteria/posisi/${id_posisi}`);

      setKriteria(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Input Nilai Pemain
  const handleInputNilai = async (pemain) => {
    // simpan pemain
    setSelectedPemain(pemain);

    // ambil kriteria
    await fetchKriteria(pemain.id_posisi);

    // ambil nilai pemain
    await fetchNilaiPemain(pemain.id);

    // tampil modal
    setShowModal(true);
  };

  const handleNilaiChange = (id, value) => {
    if (value === "") {
      setNilaiForm((prev) => ({
        ...prev,
        [id]: "",
      }));

      return;
    }

    let nilai = Number(value);

    if (nilai > 10) nilai = 10;
    if (nilai < 0) nilai = 0;

    setNilaiForm((prev) => ({
      ...prev,
      [id]: nilai,
    }));
  };

  const handleSaveNilai = async () => {
    try {
      // validasi semua kriteria terisi
      if (Object.keys(nilaiForm).length !== kriteria.length) {
        return Swal.fire({
          icon: "warning",
          title: "Data Belum Lengkap",
          text: "Semua kriteria harus diisi",
        });
      }

      // cari nilai yang tidak valid
      const invalidValue = Object.values(nilaiForm).find(
        (nilai) =>
          nilai === "" ||
          nilai === null ||
          nilai === undefined ||
          Number(nilai) < 0 ||
          Number(nilai) > 10,
      );

      // cek hasil validasi
      if (invalidValue !== undefined) {
        return Swal.fire({
          icon: "warning",
          title: "Nilai Tidak Valid",
          text: "Semua nilai harus diisi dengan rentang 0 sampai 10",
        });
      }
      // payload
      const payload = {
        id_pemain: selectedPemain.id,

        // nilai asli 0-10
        nilai_input: nilaiForm,

        // nilai hasil konversi
        nilai: Object.fromEntries(
          Object.entries(nilaiForm).map(([id, nilai]) => [
            id,
            convertNilai(nilai),
          ]),
        ),
      };

      // request save
      await api.post("/nilai", payload);

      // success
      await Swal.fire({
        icon: "success",

        title: "Berhasil",

        text: "Nilai pemain berhasil disimpan",

        timer: 1800,

        showConfirmButton: false,

        background: "#fff",

        width: 420,
      });

      // tutup modal
      setShowModal(false);

      // reset form
      setNilaiForm({});
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",

        title: "Gagal",

        text: "Gagal menyimpan nilai",

        confirmButtonColor: "#ef4444",

        background: "#fff",

        width: 420,
      });
    }
  };

  //  KONVERSI NILAI
  const convertNilai = (nilai) => {
    if (nilai >= 0 && nilai <= 2) {
      return 1;
    }

    if (nilai >= 3 && nilai <= 4) {
      return 2;
    }

    if (nilai >= 5 && nilai <= 6) {
      return 3;
    }

    if (nilai >= 7 && nilai <= 8) {
      return 4;
    }

    if (nilai >= 9 && nilai <= 10) {
      return 5;
    }

    return 0;
  };

  const fetchNilaiPemain = async (id_pemain) => {
    try {
      const response = await api.get(`/nilai/pemain/${id_pemain}`);

      // ubah array → object
      const formattedNilai = {};

      response.data.data.forEach((item) => {
        formattedNilai[item.id_kriteria] = item.nilai_input || 0;
        console.log(item);
      });

      setNilaiForm(formattedNilai);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <div className={page.pageHeader}>
        {/* LEFT */}
        <div>
          <h1 className={page.pageTitle}>Data Nilai Pemain</h1>

          <p className={page.pageSubtitle}>
            Kelola nilai pemain berdasarkan posisi dan kriteria.
          </p>
        </div>

        {/* RIGHT */}
        <div className={page.headerAction}>
          <input
            type="text"
            placeholder="Cari nama atau posisi..."
            value={search}
            // onChange={handleSearchChange}
            onChange={(e) => {
              setSearch(e.target.value);

              setCurrentPage(1);
            }}
            className={page.searchInput}
          />
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* TABLE */}
          <div className={page.tableWrapper}>
            <table className={page.table}>
              {/* HEAD */}
              <thead>
                <tr>
                  <th>No</th>

                  <th>Nama</th>

                  <th>Posisi</th>

                  <th className={page.centerText}>
                    <Settings2 size={30} />
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{indexOfFirstItem + index + 1}</td>

                    <td>{item.nama}</td>

                    <td>{item.Posisi?.nama_posisi}</td>

                    <td className={page.actionColumn}>
                      <div className={page.actionGroup}>
                        <button
                          onClick={() => handleInputNilai(item)}
                          className={page.editButton}
                        >
                          <ClipboardPenLine size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className={page.pagination}>
            {/* PREVIOUS */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={page.pageButton}
            >
              &lt;&lt;
            </button>

            {/* NUMBER */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`${page.pageButton} ${
                  currentPage === index + 1 ? page.activePage : ""
                }`}
              >
                {index + 1}
              </button>
            ))}

            {/* NEXT */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={page.pageButton}
            >
              &gt;&gt;
            </button>
          </div>
          <div className={page.infoBox}>
            <h4>📌 Konversi Nilai Penilaian Pemain</h4>

            <p className={page.infoText}>
              Nilai pemain diinput oleh pelatih menggunakan rentang{" "}
              <strong>0–10</strong>.
              <br />
              Untuk menyeragamkan instrumen penilaian pada proses metode
              ELECTRE, sistem mengonversi nilai tersebut ke dalam skala
              <strong> 1–5 </strong>
              sebelum dilakukan proses perhitungan.
            </p>

            <div className={page.scaleGrid}>
              <div className={page.scaleItem}>
                <span className={page.scaleBadge}>1</span>
                <span>0 - 2</span>
                <span className={page.scaleLabel}>Sangat Kurang</span>
              </div>

              <div className={page.scaleItem}>
                <span className={page.scaleBadge}>2</span>
                <span>3 - 4</span>
                <span className={page.scaleLabel}>Kurang</span>
              </div>

              <div className={page.scaleItem}>
                <span className={page.scaleBadge}>3</span>
                <span>5 - 6</span>
                <span className={page.scaleLabel}>Cukup</span>
              </div>

              <div className={page.scaleItem}>
                <span className={page.scaleBadge}>4</span>
                <span>7 - 8</span>
                <span className={page.scaleLabel}>Baik</span>
              </div>

              <div className={page.scaleItem}>
                <span className={page.scaleBadge}>5</span>
                <span>9 - 10</span>
                <span className={page.scaleLabel}>Sangat Baik</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className={page.modalOverlay}>
          <div className={page.modal}>
            {/* HEADER */}
            <div className={page.modalHeader}>
              <h2 className={page.modalTitle}>Input Nilai Pemain</h2>
            </div>

            {/* INFO PEMAIN */}
            <div className="mb-5">
              <p>
                <strong>Nama:</strong> {selectedPemain?.nama}
              </p>

              <p>
                <strong>Posisi:</strong> {selectedPemain?.Posisi?.nama_posisi}
              </p>
            </div>

            {/* FORM */}
            <div>
              {kriteria.map((item) => (
                <div key={item.id} className={page.formGroup}>
                  <label className={page.label}>{item.nama_kriteria}</label>

                  <input
                    type="number"
                    min="0"
                    max="10"
                    placeholder="0 - 10"
                    className={page.input}
                    value={nilaiForm[item.id] || ""}
                    onChange={(e) => handleNilaiChange(item.id, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <div className={page.modalAction}>
              <button
                onClick={() => setShowModal(false)}
                className={page.secondaryButton}
              >
                Batal
              </button>

              <button onClick={handleSaveNilai} className={page.primaryButton}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Nilai;
