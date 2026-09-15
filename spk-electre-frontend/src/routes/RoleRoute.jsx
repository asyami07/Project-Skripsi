import { Navigate } from "react-router-dom";

function RoleRoute({ children, allowedRoles }) {
  // ambil user
  const user = JSON.parse(localStorage.getItem("user"));

  // jika user tidak ada
  if (!user) {
    return <Navigate to="/" />;
  }

  // cek role user
  if (!allowedRoles.includes(user.role)) {
    // redirect dashboard
    return <Navigate to="/dashboard" />;
  }

  // jika role sesuai
  return children;
}

export default RoleRoute;
