import styles from "./Navbar.module.css";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className={styles.navbar}>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeText}>
          🏆 Selamat Datang di STARTS'Lineup | Sistem Pendukung Keputusan
          Pemilihan Lineup Sepak Bola Menggunakan Metode ELECTRE ⚽
        </div>
      </div>

      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {user?.username?.charAt(0).toUpperCase()}
        </div>

        <p>{user?.role}</p>
      </div>
    </div>
  );
}

export default Navbar;
