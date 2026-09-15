import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // ambil token dari localStorage
  const token = localStorage.getItem("token");

  // jika tidak ada token
  if (!token) {
    // redirect ke login
    return <Navigate to="/" />;
  }

  // jika token ada
  return children;
}

export default ProtectedRoute;
