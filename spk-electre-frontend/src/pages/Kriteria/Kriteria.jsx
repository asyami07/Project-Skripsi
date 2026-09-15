import { useEffect, useState } from "react";

import api from "../../api/axios";

import MainLayout from "../../layouts/MainLayout";

import Swal from "sweetalert2";

import page from "../../styles/Page.module.css";

import { Pencil, Trash2, Settings2 } from "lucide-react";

function Kriteria() {
  // state data
  const [kriteria, setKriteria] = useState([]);

  // loading
  const [loading, setLoading] = useState(true);

  // modal
  const [showModal, setShowModal] = useState(false);

  // posisi
  const [posisiList, setPosisiList] = useState([]);

  // form
  const [form, setForm] = useState({
    nama_kriteria: "",
    tipe: "benefit",
    bobot: "",
    posisi: [],
  });

  // edit
  const [editId, setEditId] = useState(null);

  // search
  const [search, setSearch] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // FILTER
  const filteredKriteria = kriteria.filter(
    (item) =>
      item.nama_kriteria.toLowerCase().includes(search.toLowerCase()) ||
      item.Posisi?.nama_posisi.toLowerCase().includes(search.toLowerCase()),
  );

  // PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredKriteria.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const totalPages = Math.ceil(filteredKriteria.length / itemsPerPage);

  // GET KRITERIA
  const fetchKriteria = async () => {
    try {
      setLoading(true);

      const response = await api.get("/kriteria");
      console.log(response.data.data);

      setKriteria(response.data.data);
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data kriteria",
      });
    } finally {
      setLoading(false);
    }
  };

  // GET POSISI
  const fetchPosisi = async () => {
    try {
      const response = await api.get("/posisi");

      setPosisiList(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Kriteria?",
      text: "Data kriteria akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/kriteria/${id}`);

      fetchKriteria();

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kriteria berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // EDIT
  const handleEdit = (item) => {
    setEditId(item.id);

    setForm({
      nama_kriteria: item.nama_kriteria,

      tipe: item.tipe,

      bobot: item.bobot,

      posisi: [item.id_posisi],
    });

    setShowModal(true);
  };

  // LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      await fetchKriteria();

      await fetchPosisi();
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;

    // khusus bobot
    if (e.target.name === "bobot") {
      if (value === "") {
        setForm({
          ...form,
          bobot: "",
        });

        return;
      }

      value = Number(value);

      if (value > 5) {
        Swal.fire({
          icon: "warning",
          title: "Bobot Tidak Valid",
          text: "Bobot kriteria harus berada pada skala 1 sampai 5",
          timer: 2000,
          showConfirmButton: false,
        });

        value = 5;
      }

      if (value < 1) {
        value = 1;
      }
    }

    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/kriteria/${editId}`, form);

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Kriteria berhasil diupdate",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await api.post("/kriteria", form);

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Kriteria berhasil ditambahkan",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      fetchKriteria();

      setForm({
        nama_kriteria: "",
        tipe: "benefit",
        bobot: "",
        id_posisi: "",
      });

      setEditId(null);

      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePosisiChange = (id) => {
    setForm((prev) => ({
      ...prev,
      posisi: prev.posisi.includes(id)
        ? prev.posisi.filter((item) => item !== id)
        : [...prev.posisi, id],
    }));
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className={page.pageHeader}>
        <div>
          <h1 className={page.pageTitle}>Kelola Data Kriteria</h1>

          <p className={page.pageSubtitle}>
            Data kriteria bobot pada setiap posisi pemain
          </p>
        </div>

        <div className={page.headerAction}>
          <input
            type="text"
            placeholder="Cari kriteria..."
            value={search}
            // onChange={handleSearchChange}
            onChange={(e) => {
              setSearch(e.target.value);

              setCurrentPage(1);
            }}
            className={page.searchInput}
          />

          <button
            onClick={() => setShowModal(true)}
            className={page.primaryButton}
          >
            + Tambah Kriteria
          </button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className={page.loading}>Loading...</div>
      ) : (
        <div className={page.tableWrapper}>
          <table className={page.table}>
            <thead>
              <tr>
                <th>No</th>

                <th>Nama Kriteria</th>

                <th>Posisi</th>

                <th>Bobot</th>

                <th>Tipe</th>

                <th className={page.centerText}>
                  <Settings2 size={30} />
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirstItem + index + 1}</td>

                  <td>{item.nama_kriteria}</td>

                  <td>{item.Posisi?.nama_posisi}</td>

                  <td>{item.bobot}</td>

                  <td>
                    <span className={page.successBadge}>{item.tipe}</span>
                  </td>

                  <td>
                    <div className={page.actionGroup}>
                      <button
                        onClick={() => handleEdit(item)}
                        className={page.editButton}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className={page.deleteButton}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <h4>📌 Skala Kepentingan Kriteria</h4>

            <div className={page.scaleGrid}>
              <div className={page.scaleItem}>
                <span className={page.scaleBadge}>1</span>
                <span>Sangat Rendah</span>
              </div>

              <div className={page.scaleItem}>
                <span className={page.scaleBadge}>2</span>
                <span>Rendah</span>
              </div>

              <div className={page.scaleItem}>
                <span className={page.scaleBadge}>3</span>
                <span>Sedang</span>
              </div>

              <div className={page.scaleItem}>
                <span className={page.scaleBadge}>4</span>
                <span>Tinggi</span>
              </div>

              <div className={page.scaleItem}>
                <span className={page.scaleBadge}>5</span>
                <span>Sangat Tinggi</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className={page.modalOverlay}>
          <div className={page.modal}>
            <h2 className={page.modalTitle}>
              {editId ? "Edit Kriteria" : "Tambah Kriteria"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className={page.formGroup}>
                <label>Nama Kriteria</label>

                <input
                  type="text"
                  name="nama_kriteria"
                  value={form.nama_kriteria}
                  onChange={handleChange}
                />
              </div>

              <div className={page.formGroup}>
                <label>Posisi</label>

                <div className={page.checkboxGroup}>
                  {posisiList.map((posisi) => (
                    <label key={posisi.id} className={page.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={form.posisi.includes(posisi.id)}
                        onChange={() => handlePosisiChange(posisi.id)}
                      />

                      <span>{posisi.nama_posisi}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={page.formGroup}>
                <label>Bobot</label>

                <input
                  type="number"
                  min="1"
                  max="5"
                  name="bobot"
                  value={form.bobot}
                  onChange={handleChange}
                />
              </div>

              <div className={page.formGroup}>
                <label>Tipe</label>

                <select name="tipe" value={form.tipe} onChange={handleChange}>
                  <option value="benefit">Benefit</option>

                  <option value="cost">Cost</option>
                </select>
              </div>

              <div className={page.modalAction}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);

                    setEditId(null);
                  }}
                  className={page.secondaryButton}
                >
                  Batal
                </button>

                <button type="submit" className={page.primaryButton}>
                  {editId ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Kriteria;
