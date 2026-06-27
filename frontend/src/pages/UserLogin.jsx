import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

function UserLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    else navigate("/chatpage");
  };

  return (
    <div className="page-shell">
      <div className="auth-card">
        <div className="auth-header">
          <span className="brand-badge">User Login</span>
          <h1>Welcome back</h1>
          <p>Sign in to continue your support conversation.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error ? <div className="error-box">{error}</div> : null}

          <label className="input-group">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="input-group">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          <button type="submit" className="btn btn-block">
            Login
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/register">Create an account</Link>
          <Link to="/admin/login">Admin login</Link>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
