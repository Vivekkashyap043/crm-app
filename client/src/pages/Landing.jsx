import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: 28 }} role="img" aria-label="CRM">📋</span>
            <span className="navbar-brand fw-bold" style={{ fontSize: 24 }}>CRM Pro</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-link text-white fw-bold" style={{ textDecoration: 'none' }} onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-light fw-bold px-4" onClick={() => navigate('/register')}>Get Started</button>
          </div>
        </div>
      </nav>
      <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '80vh' }}>
        <h1 className="fw-bold mb-3" style={{ fontSize: '4rem', color: '#fff' }}>Supercharge Your<br />Sales Pipeline</h1>
        <p className="lead mb-4" style={{ color: '#e0e7ef', fontSize: 24, maxWidth: 700 }}>
          Transform your customer relationships with our powerful CRM platform. Manage leads, track sales, and boost revenue like never before.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn btn-light fw-bold px-4 py-2" style={{ fontSize: 20 }} onClick={() => navigate('/register')}>Start Free Trial</button>
          <button className="btn btn-outline-light fw-bold px-4 py-2" style={{ fontSize: 20 }} onClick={() => navigate('/login')}>View Demo</button>
        </div>
      </div>
    </div>
  );
}
