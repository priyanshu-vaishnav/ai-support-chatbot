import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes  from "./components/ProtectedRoute.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import AdminLogin from "./pages/AdminLogin.jsx";
import ChatPage from "./pages/ChatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatPage />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoutes>
        <AdminDashboard />
      </ProtectedRoutes>
    ),
  },
]);
