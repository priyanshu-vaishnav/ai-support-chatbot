import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-shell">
        <div className="auth-card loading-card">Preparing your dashboard...</div>
      </div>
    );
  }

  return user && user.user_metadata?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/admin/login" />
  );
}
