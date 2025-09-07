import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(90deg, #312e81 0%, #6366f1 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold" style={{ fontSize: 24 }} to="/dashboard">CRM App</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/dashboard' ? ' active-tab' : ''}`} to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/customers' ? ' active-tab' : ''}`} to="/customers">Customers</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/leads' ? ' active-tab' : ''}`} to="/leads">Leads</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/reporting' ? ' active-tab' : ''}`} to="/reporting">Reporting</Link>
            </li>
          </ul>
          <ul className="navbar-nav align-items-center">
            {isAuthenticated ? (
              <>
                <li className="nav-item me-3">
                  <span className="fw-bold text-white" style={{ fontSize: 16 }}>
                    {user?.name ? `👤 ${user.name}` : ''}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
