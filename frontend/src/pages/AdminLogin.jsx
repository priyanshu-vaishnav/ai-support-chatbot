import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    else navigate("/admin/dashboard");
  };

  return (
    <div className="page-shell">
      <div className="auth-card">
        <div className="auth-header">
          <span className="brand-badge">Admin Portal</span>
          <h1>Secure admin access</h1>
          <p>Manage support tickets and respond to customers efficiently.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error ? <div className="error-box">{error}</div> : null}

          <label className="input-group">
            <span>Email</span>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="input-group">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-block">
            Login
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">User login</Link>
        </div>
      </div>
    </div>
  );
}
