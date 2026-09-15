import { useEffect, useState } from "react";

import api from "../../api/axios";

import MainLayout from "../../layouts/MainLayout";

import Swal from "sweetalert2";

import page from "../../styles/Page.module.css";

import { Pencil, Trash2, Settings2 } from "lucide-react";

function Users() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "pelatih",
  });

  // FILTER
  const filteredUsers = users.filter(
    (item) =>
      item.username.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase()),
  );

  // PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // GET USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");

      setUsers(response.data.data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data user",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
    };

    loadData();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus User?",
      text: "Data user akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/users/${id}`);

      fetchUsers();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "User berhasil dihapus",
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
      username: item.username,
      password: "",
      role: item.role,
    });

    setShowModal(true);
  };

  // CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.username.trim()) {
        return Swal.fire({
          icon: "warning",
          title: "Username wajib diisi",
        });
      }

      if (!editId && !form.password.trim()) {
        return Swal.fire({
          icon: "warning",
          title: "Password wajib diisi",
        });
      }

      if (editId) {
        await api.put(`/users/${editId}`, form);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "User berhasil diupdate",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await api.post("/users", form);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "User berhasil ditambahkan",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      fetchUsers();

      setForm({
        username: "",
        password: "",
        role: "pelatih",
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
          <h1 className={page.pageTitle}>Kelola User</h1>

          <p className={page.pageSubtitle}>Data pengguna sistem</p>
        </div>

        <div className={page.headerAction}>
          <input
            type="text"
            placeholder="Cari user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={page.searchInput}
          />

          <button
            onClick={() => setShowModal(true)}
            className={page.primaryButton}
          >
            + Tambah User
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
                <th>Username</th>
                <th>Role</th>
                <th className={page.centerText}>
                  <Settings2 size={30} />
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirstItem + index + 1}</td>

                  <td>{item.username}</td>

                  <td>
                    <span
                      className={
                        item.role === "admin"
                          ? page.successBadge
                          : page.warningBadge
                      }
                    >
                      {item.role}
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
              {editId ? "Edit User" : "Tambah User"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className={page.formGroup}>
                <label>Username</label>

                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>

              <div className={page.formGroup}>
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    editId ? "Kosongkan jika tidak diubah" : "Masukkan password"
                  }
                />
              </div>

              <div className={page.formGroup}>
                <label>Role</label>

                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="admin">Admin</option>

                  <option value="pelatih">Pelatih</option>
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

export default Users;
