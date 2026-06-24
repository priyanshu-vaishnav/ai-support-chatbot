import { Navigate } from "react-router-dom"
import { useAuth } from "../services/authContext"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>
  return user ? children : <Navigate to="/" />
}