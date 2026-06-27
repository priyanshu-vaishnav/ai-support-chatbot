import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-shell">
      <div className="hero-card">
        <div className="brand-row">
          <span className="brand-badge">AI Support Hub</span>
          <div className="nav-links">
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
            <Link to="/login" className="btn">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Smart support for modern teams</p>
            <h1>Fast, friendly support for users and admins.</h1>
            <p className="hero-copy">
              Handle tickets, reply instantly, and keep your support flow organized from one beautiful dashboard.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn">
                Create account
              </Link>
              <Link to="/admin/login" className="btn btn-secondary">
                Admin portal
              </Link>
            </div>
          </div>

          <div className="feature-stack">
            <div className="feature-card">
              <h3>⚡ Instant help</h3>
              <p>Users can start conversations and get guided support quickly.</p>
            </div>
            <div className="feature-card">
              <h3>🛠️ Admin control</h3>
              <p>Admins can manage tickets, reply, and resolve them in one place.</p>
            </div>
            <div className="feature-card">
              <h3>🚀 Vercel ready</h3>
              <p>Built with a polished UI and SPA routing for smooth deployment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
