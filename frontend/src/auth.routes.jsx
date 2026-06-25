import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ChatPage from "./pages/ChatPage";
import UserRegister from "./pages/UserRegister.jsx";
import UserLogin from "./pages/UserLogin.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <UserLogin />,
  },
  {
    path: "/register",
    element: <UserRegister />,
  },
  {
    path: "/chatpage",
    element:(
      
      <ChatPage />
  
    ),
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
