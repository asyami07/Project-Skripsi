import { Routes, Route } from "react-router-dom";

// PAGES
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Pemain from "./pages/Pemain/Pemain";
import Nilai from "./pages/Nilai/Nilai";
import Kriteria from "./pages/Kriteria/Kriteria";
import Formasi from "./pages/Formasi/Formasi";
import GenerateLineup from "./pages/Lineup/GenerateLineup";
import Users from "./pages/Users/Users";

// ROUTES PROTECTION
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

// contoh halaman nanti
// import Pemain from "./pages/Pemain/Pemain";
// import Users from "./pages/Users/Users";

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin", "pelatih"]}>
              <Dashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pemain"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <Pemain />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nilai"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin", "pelatih"]}>
              <Nilai />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kriteria"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin", "pelatih"]}>
              <Kriteria />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/formasi"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin", "pelatih"]}>
              <Formasi />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/lineup"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin", "pelatih"]}>
              <GenerateLineup />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <Users />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
