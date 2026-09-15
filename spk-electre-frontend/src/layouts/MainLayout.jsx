import Sidebar from "../components/Sidebar/Sidebar";

import Navbar from "../components/Navbar/Navbar";

import styles from "./MainLayout.module.css";

function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className={styles.content}>
        {/* NAVBAR */}
        <Navbar />

        {/* PAGE */}
        <div className={styles.page}>
          <div className={styles.pageContent}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
