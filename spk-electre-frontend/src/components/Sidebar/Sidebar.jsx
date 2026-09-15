import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Trophy,
  Layers3,
  WandSparkles,
  LogOut,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";

import logo from "../../assets/phoenix-fix-final.png";

import Swal from "sweetalert2";

function Sidebar() {
  const navigate = useNavigate();

  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Konfirmasi Logout",
      text: "Sesi Anda akan diakhiri dan kembali ke halaman login.",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",

      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",

      reverseButtons: true,
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      await Swal.fire({
        title: "Berhasil",
        text: "Anda telah logout dari sistem",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    }
  };

  // MENU BERDASARKAN ROLE
  const menus =
    user?.role === "admin"
      ? [
          {
            name: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={20} />,
          },
          {
            name: "Pemain",
            path: "/pemain",
            icon: <Users size={20} />,
          },
          {
            name: "Kriteria",
            path: "/kriteria",
            icon: <Trophy size={20} />,
          },
          {
            name: "Nilai",
            path: "/nilai",
            icon: <ClipboardList size={20} />,
          },
          {
            name: "Formasi",
            path: "/formasi",
            icon: <Layers3 size={20} />,
          },
          {
            name: "Generate Lineup",
            path: "/lineup",
            icon: <WandSparkles size={20} />,
          },
          {
            name: "Kelola User",
            path: "/users",
            icon: <Users size={20} />,
          },
        ]
      : [
          {
            name: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={20} />,
          },
          {
            name: "Nilai",
            path: "/nilai",
            icon: <ClipboardList size={20} />,
          },
          {
            name: "Generate Lineup",
            path: "/lineup",
            icon: <WandSparkles size={20} />,
          },
        ];

  return (
    <div className={styles.sidebar}>
      {/* LOGO */}
      <div className={styles.logo}>
        <img src={logo} alt="Logo" className={styles.logoImage} />

        <div className={styles.logoText}>
          <h1>STARTS'Lineup</h1>

          <p>© 2026 Andika</p>
        </div>
      </div>

      {/* MENU */}
      <div className={styles.menuWrapper}>
        {menus.map((menu, index) => (
          <Link
            key={index}
            to={menu.path}
            className={`${styles.menuItem} ${
              location.pathname === menu.path ? styles.active : ""
            }`}
          >
            {menu.icon}

            <span>{menu.name}</span>
          </Link>
        ))}
      </div>
      {/* LOGOUT */}
      <div className={styles.sidebarFooter}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
export default Sidebar;
