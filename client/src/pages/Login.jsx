import React, { useState } from 'react';

import axios from 'axios';
import API_BASE_URL from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      console.log('Login response:', res.data);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }} className="d-flex align-items-center justify-content-center">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0 text-white">
            <h1 className="fw-bold mb-3" style={{ fontSize: '3rem' }}>CRM Pro</h1>
            <p className="lead mb-4">Streamline your customer relationships and boost sales with our powerful CRM platform.</p>
            <div className="d-flex gap-3 flex-wrap">
              <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.08)', minWidth: 180 }}>
                <div className="fw-bold mb-1">📋 Manage Customers</div>
                <div style={{ fontSize: 14 }}>Organize and track all your customer information</div>
              </div>
              <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.08)', minWidth: 180 }}>
                <div className="fw-bold mb-1">👥 Track Leads</div>
                <div style={{ fontSize: 14 }}>Convert prospects into loyal customers</div>
              </div>
              <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.08)', minWidth: 180 }}>
                <div className="fw-bold mb-1">📈 Boost Sales</div>
                <div style={{ fontSize: 14 }}>Analyze performance and grow revenue</div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card p-4 shadow-lg border-0" style={{ borderRadius: 16, minWidth: 340, maxWidth: 400, margin: '0 auto' }}>
              <h2 className="mb-2 text-center fw-bold" style={{ color: '#1e293b' }}>Welcome to CRM Pro</h2>
              <div className="mb-3 text-center text-muted" style={{ fontSize: 15 }}>Sign in to your account or create a new one</div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input type="email" className="form-control form-control-lg" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <input type="password" className="form-control form-control-lg" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn w-100 fw-bold" style={{ background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)', color: '#fff', fontSize: 18 }}>Sign In</button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </form>
              <div className="mt-3 text-center">
                <span className="text-muted">Don't have an account? </span>
                <button className="btn btn-link p-0 fw-bold" style={{ color: '#2563eb' }} onClick={() => navigate('/register')}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
