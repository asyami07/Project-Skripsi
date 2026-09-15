import { useEffect, useState } from "react";

import api from "../../api/axios";

import MainLayout from "../../layouts/MainLayout";

import Swal from "sweetalert2";

import page from "../../styles/Page.module.css";

import { Pencil, Trash2, Settings2 } from "lucide-react";

function Formasi() {
  // data
  const [formasi, setFormasi] = useState([]);

  // loading
  const [loading, setLoading] = useState(true);

  // modal
  const [showModal, setShowModal] = useState(false);

  // edit
  const [editId, setEditId] = useState(null);

  // search
  const [search, setSearch] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // form
  const [form, setForm] = useState({
    nama_formasi: "",
    jumlah_gk: 1,
    jumlah_df: "",
    jumlah_mf: "",
    jumlah_fw: "",
  });

  // filter
  const filteredFormasi = formasi.filter((item) =>
    item.nama_formasi.toLowerCase().includes(search.toLowerCase()),
  );

  // pagination
  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredFormasi.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredFormasi.length / itemsPerPage);

  // GET DATA
  const fetchFormasi = async () => {
    try {
      setLoading(true);

      const response = await api.get("/formasi");

      setFormasi(response.data.data);
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data formasi",
      });
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Formasi?",
      text: "Data formasi akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/formasi/${id}`);

      fetchFormasi();

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Formasi berhasil dihapus",
        timer: 1800,
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
      nama_formasi: item.nama_formasi,

      jumlah_gk: item.jumlah_gk,

      jumlah_df: item.jumlah_df,

      jumlah_mf: item.jumlah_mf,

      jumlah_fw: item.jumlah_fw,
    });

    setShowModal(true);
  };

  // LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      await fetchFormasi();
    };

    loadData();
  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(form.jumlah_gk) !== 1) {
      return Swal.fire({
        icon: "warning",
        title: "Formasi Tidak Valid",
        text: "Jumlah Goalkeeper harus 1",
      });
    }

    const total =
      Number(form.jumlah_gk) +
      Number(form.jumlah_df) +
      Number(form.jumlah_mf) +
      Number(form.jumlah_fw);

    if (total !== 11) {
      return Swal.fire({
        icon: "warning",
        title: "Formasi Tidak Valid",
        text: "Total pemain harus 11 orang",
      });
    }

    try {
      if (editId) {
        await api.put(`/formasi/${editId}`, form);

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Formasi berhasil diupdate",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await api.post("/formasi", form);

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Formasi berhasil ditambahkan",
          timer: 1800,
          showConfirmButton: false,
        });
      }

      fetchFormasi();

      setForm({
        nama_formasi: "",
        jumlah_gk: 1,
        jumlah_df: "",
        jumlah_mf: "",
        jumlah_fw: "",
      });

      setEditId(null);

      setShowModal(false);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className={page.pageHeader}>
        <div>
          <h1 className={page.pageTitle}>Kelola Formasi</h1>

          <p className={page.pageSubtitle}>Data formasi permainan</p>
        </div>

        <div className={page.headerAction}>
          <input
            type="text"
            placeholder="Cari formasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={page.searchInput}
          />

          <button
            onClick={() => setShowModal(true)}
            className={page.primaryButton}
          >
            + Tambah Formasi
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

                <th>Formasi</th>

                <th>GK</th>

                <th>DF</th>

                <th>MF</th>

                <th>FW</th>

                <th>Total</th>

                <th className={page.centerText}>
                  <Settings2 size={30} />
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirstItem + index + 1}</td>

                  <td>{item.nama_formasi}</td>

                  <td>{item.jumlah_gk}</td>

                  <td>{item.jumlah_df}</td>

                  <td>{item.jumlah_mf}</td>

                  <td>{item.jumlah_fw}</td>

                  <td>
                    {item.jumlah_gk +
                      item.jumlah_df +
                      item.jumlah_mf +
                      item.jumlah_fw}
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
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={page.pageButton}
            >
              &lt;&lt;
            </button>

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
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className={page.modalOverlay}>
          <div className={page.modal}>
            <h2 className={page.modalTitle}>
              {editId ? "Edit Formasi" : "Tambah Formasi"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className={page.formGroup}>
                <label>Nama Formasi</label>

                <input
                  type="text"
                  name="nama_formasi"
                  value={form.nama_formasi}
                  onChange={handleChange}
                  placeholder="4-3-3"
                />
              </div>

              <div className={page.formGroup}>
                <label>GK</label>
                <input
                  type="number"
                  name="jumlah_gk"
                  value={form.jumlah_gk}
                  onChange={handleChange}
                />
              </div>

              <div className={page.formGroup}>
                <label>DF</label>
                <input
                  type="number"
                  name="jumlah_df"
                  value={form.jumlah_df}
                  onChange={handleChange}
                />
              </div>

              <div className={page.formGroup}>
                <label>MF</label>
                <input
                  type="number"
                  name="jumlah_mf"
                  value={form.jumlah_mf}
                  onChange={handleChange}
                />
              </div>

              <div className={page.formGroup}>
                <label>FW</label>
                <input
                  type="number"
                  name="jumlah_fw"
                  value={form.jumlah_fw}
                  onChange={handleChange}
                />
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

export default Formasi;
