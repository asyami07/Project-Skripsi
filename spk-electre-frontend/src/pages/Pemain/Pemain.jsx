import { useEffect, useState } from "react";

import api from "../../api/axios";

import MainLayout from "../../layouts/MainLayout";

import Swal from "sweetalert2";

import page from "../../styles/Page.module.css";

import { Pencil, Trash2, Settings2 } from "lucide-react";

function Pemain() {
  // state data pemain
  const [pemain, setPemain] = useState([]);

  // loading
  const [loading, setLoading] = useState(true);

  // modal
  const [showModal, setShowModal] = useState(false);

  // form
  const [form, setForm] = useState({
    nama: "",
    id_posisi: "",
    status: "fit",
  });

  // edit
  const [editId, setEditId] = useState(null);

  // posisi
  const [posisiList, setPosisiList] = useState([]);

  // search
  const [search, setSearch] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // FILTER
  const filteredPemain = pemain.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.Posisi?.nama_posisi.toLowerCase().includes(search.toLowerCase()),
  );

  // PAGINATION
  // hitung index
  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // data tampil
  const currentItems = filteredPemain.slice(indexOfFirstItem, indexOfLastItem);

  // total halaman
  const totalPages = Math.ceil(filteredPemain.length / itemsPerPage);

  // GET DATA Pemain
  const fetchPemain = async () => {
    try {
      setLoading(true);

      // request API
      const response = await api.get("/pemain");

      // simpan data
      setPemain(response.data.data);
    } catch {
      await Swal.fire({
        icon: "error",

        title: "Error",

        text: "Gagal mengambil data pemain",

        confirmButtonColor: "#ef4444",

        background: "#fff",

        width: 420,

        customClass: {
          popup: "modern-swal",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  //  DELETE Pemain
  const handleDelete = async (id) => {
    // konfirmasi delete
    const result = await Swal.fire({
      title: "Hapus Pemain?",

      text: "Data pemain akan dihapus permanen",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#ef4444",

      cancelButtonColor: "#9ca3af",

      confirmButtonText: "Ya, Hapus",

      cancelButtonText: "Batal",

      background: "#fff",

      color: "#222",

      width: 420,

      customClass: {
        popup: "modern-swal",
        title: "modern-swal-title",
        htmlContainer: "modern-swal-text",
      },
    });

    // batal
    if (!result.isConfirmed) return;

    try {
      // request delete
      await api.delete(`/pemain/${id}`);

      // refresh data
      fetchPemain();

      // success
      await Swal.fire({
        icon: "success",

        title: "Berhasil",

        text: "Data pemain berhasil dihapus",

        timer: 1800,

        showConfirmButton: false,

        background: "#fff",

        width: 420,

        customClass: {
          popup: "modern-swal",
        },
      });
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",

        title: "Gagal",

        text: "Gagal menghapus pemain",

        confirmButtonColor: "#ef4444",

        background: "#fff",

        width: 420,

        customClass: {
          popup: "modern-swal",
        },
      });
    }
  };

  // Edit Pemain
  const handleEdit = (item) => {
    // simpan id edit
    setEditId(item.id);

    // isi form
    setForm({
      nama: item.nama,
      id_posisi: item.id_posisi,
      status: item.status,
    });

    // buka modal
    setShowModal(true);
  };

  // Get data Posisi
  const fetchPosisi = async () => {
    try {
      const response = await api.get("/posisi");

      setPosisiList(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      await fetchPemain();
      await fetchPosisi();
    };

    loadData();
  }, []);

  // const handleSearchChange = (e) => {
  //   setSearch(e.target.value);
  //   setCurrentPage(1);
  // };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Tambah pemain
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        // UPDATE
        await api.put(`/pemain/${editId}`, form);

        await Swal.fire({
          icon: "success",

          title: "Berhasil",

          text: "Data pemain berhasil diupdate",

          timer: 1800,

          showConfirmButton: false,

          background: "#fff",

          width: 420,

          customClass: {
            popup: "modern-swal",
          },
        });
      } else {
        // CREATE
        await api.post("/pemain", form);

        await Swal.fire({
          icon: "success",

          title: "Berhasil",

          text: "Data pemain berhasil ditambahkan",

          timer: 1800,

          showConfirmButton: false,

          background: "#fff",

          width: 420,

          customClass: {
            popup: "modern-swal",
          },
        });
      }

      // refresh
      fetchPemain();

      // reset form
      setForm({
        nama: "",
        id_posisi: "",
        status: "fit",
      });

      // reset edit
      setEditId(null);

      // close modal
      setShowModal(false);
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",

        title: "Gagal",

        text: "Terjadi kesalahan",

        confirmButtonColor: "#ef4444",

        background: "#fff",

        width: 420,

        customClass: {
          popup: "modern-swal",
        },
      });
    }
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className={page.pageHeader}>
        <div>
          <h1 className={page.pageTitle}>Kelola Data Pemain</h1>

          <p className={page.pageSubtitle}>
            {" "}
            Daftar Pemain Tim Sepak Bola SSB Metro Kukusan
          </p>
        </div>
        <div className={page.headerAction}>
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Cari pemain..."
            value={search}
            // onChange={handleSearchChange}
            onChange={(e) => {
              setSearch(e.target.value);

              setCurrentPage(1);
            }}
            className={page.searchInput}
          />

          {/* BUTTON */}
          <button
            onClick={() => setShowModal(true)}
            className={page.primaryButton}
          >
            + Tambah Pemain
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className={page.loading}>Loading...</div>
      ) : (
        <div className={page.tableWrapper}>
          <table className={page.table}>
            {/* HEAD */}
            <thead>
              <tr>
                <th>No</th>

                <th>Nama</th>

                <th>Posisi</th>

                <th>Status</th>

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

                  <td>
                    <span
                      className={
                        item.status === "fit"
                          ? page.successBadge
                          : page.dangerBadge
                      }
                    >
                      {item.status}
                    </span>
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
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className={page.modalOverlay}>
          <div className={page.modal}>
            <h2 className={page.modalTitle}>
              {editId ? "Edit Pemain" : "Tambah Pemain"}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* NAMA */}
              <div className={page.formGroup}>
                <label>Nama Pemain</label>

                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama pemain"
                />
              </div>

              {/* POSISI */}
              <div className={page.formGroup}>
                <label>Posisi</label>

                <select
                  name="id_posisi"
                  value={form.id_posisi}
                  onChange={handleChange}
                >
                  <option value="">Pilih posisi</option>

                  {posisiList.map((posisi) => (
                    <option key={posisi.id} value={posisi.id}>
                      {posisi.nama_posisi}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <div className={page.formGroup}>
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="fit">Fit</option>

                  <option value="cedera">Cedera</option>
                </select>
              </div>

              {/* BUTTON */}
              <div className={page.modalAction}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);

                    setEditId(null);

                    setForm({
                      nama: "",
                      id_posisi: "",
                      status: "fit",
                    });
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

export default Pemain;
