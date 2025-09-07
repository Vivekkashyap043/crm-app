import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Leads from './pages/Leads';
import Reporting from './pages/Reporting';
import Landing from './pages/Landing';

import { useAuth } from './context/AuthContext';

function App() {
  // Use AuthContext for live auth state
  const { token } = useAuth() || {};
  const isAuthenticated = !!token;
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)' }}>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={isAuthenticated ? <><Navbar /><Dashboard /></> : <Navigate to="/login" />} />
          <Route path="/customers" element={isAuthenticated ? <><Navbar /><Customers /></> : <Navigate to="/login" />} />
          <Route path="/customers/:id" element={isAuthenticated ? <><Navbar /><CustomerDetail /></> : <Navigate to="/login" />} />
          <Route path="/leads" element={isAuthenticated ? <><Navbar /><Leads /></> : <Navigate to="/login" />} />
          <Route path="/reporting" element={isAuthenticated ? <><Navbar /><Reporting /></> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default function AppWithProvider() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
