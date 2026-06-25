import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return <div style={{ padding: "40px" }}>Loading Please wait...</div>;
  console.log(user);
  
  
  return user && user.user_metadata.role === "admin" ? (
    children
  ) : (
    
    <Navigate to="/chatpage" />
  );
}
