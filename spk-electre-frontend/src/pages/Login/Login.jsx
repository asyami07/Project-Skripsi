import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import styles from "./Login.module.css";

import logo from "../../assets/phoenix-fix-final.png";

import { Eye, EyeOff } from "lucide-react";

import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= HANDLE LOGIN ================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // request login
      const response = await api.post("/login", form);

      const { token, user } = response.data;

      // simpan token
      localStorage.setItem("token", token);

      // simpan data user
      localStorage.setItem("user", JSON.stringify(user));

      // redirect dashboard
      await Swal.fire({
        icon: "success",

        title: `welcome to ${user.username}`,

        text:
          user.role === "admin"
            ? "Login successfully (admin)"
            : "Login successfully (pelatih)",

        showConfirmButton: false,

        timer: 2200,

        background: "#ffffff",

        color: "#222",

        width: 420,

        customClass: {
          popup: "modern-swal",
          title: "modern-swal-title",
          htmlContainer: "modern-swal-text",
        },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",

        title: "Login Gagal",

        text: error.response?.data?.message || "Username atau password salah",

        confirmButtonText: "Coba lagi",

        confirmButtonColor: "#ef4444",

        background: "#fff",

        color: "#222",

        width: 420,

        customClass: {
          popup: "modern-swal",
          title: "modern-swal-title",
          htmlContainer: "modern-swal-text",
        },
      });

      setError(error.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className={styles.loginPage}>
      {/* LOGIN CARD */}
      <div className={styles.loginCard}>
        {/* LOGO */}
        <div className={styles.logo}>
          <img src={logo} alt="SPK ELECTRE" className={styles.logoImage} />

          <h1 className={styles.logoTitle}>STARTS'Lineup</h1>
        </div>

        {/* TITLE */}
        <h2 className={styles.title}>Sign in to account</h2>

        <p className={styles.subtitle}>Masukkan username & password anda!</p>

        {/* ERROR MESSAGE */}
        {error && <div className={styles.error}>{error}</div>}

        {/* FORM */}
        <form onSubmit={handleLogin}>
          {/* USERNAME */}
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              name="username"
              placeholder="Masukkan username"
              value={form.username}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          {/* PASSWORD */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>

            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
              />

              <div
                className={styles.showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
