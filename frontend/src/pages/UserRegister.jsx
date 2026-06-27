import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function RegisterForm() {
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { error } = await signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message || "Registration failed");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration error");
    }
  };

  return (
    <div className="page-shell">
      <div className="auth-card">
        <div className="auth-header">
          <span className="brand-badge">Create account</span>
          <h1>Join AI Support Hub</h1>
          <p>Register in a few seconds and start getting help right away.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error ? <div className="error-box">{error}</div> : null}

          <label className="input-group">
            <span>Username</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </label>

          <label className="input-group">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="input-group">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
          </label>

          <button type="submit" className="btn btn-block">
            Register
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Already have an account?</Link>
        </div>
      </div>
    </div>
  );
}
