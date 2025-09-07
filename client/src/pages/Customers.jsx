
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Customers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    try {
  const res = await axios.get(`${API_BASE_URL}/api/customers?search=${search}&page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.customers);
      setTotal(res.data.total);
    } catch (err) {
      setError('Failed to fetch customers');
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [search, page]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
  await axios.put(`${API_BASE_URL}/api/customers/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
  await axios.post(`${API_BASE_URL}/api/customers`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: '', email: '', phone: '', company: '' });
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving customer');
    }
  };

  const handleEdit = customer => {
    setForm({ name: customer.name, email: customer.email, phone: customer.phone, company: customer.company });
    setEditingId(customer._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this customer?')) return;
    try {
  await axios.delete(`${API_BASE_URL}/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting customer');
    }
  };

  return (
    <div className="container py-5">
      <div className="card p-5 shadow-lg border-0 mx-auto" style={{ maxWidth: 1100, background: '#fff', borderRadius: 18 }}>
        <h1 className="mb-4 fw-bold" style={{ color: '#312e81', fontSize: 32 }}>Customers</h1>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
        <form className="row g-2 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-2">
            <input name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input name="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input name="phone" className="form-control" placeholder="Phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <input name="company" className="form-control" placeholder="Company" value={form.company} onChange={handleChange} />
          </div>
          {/* Button row below, centered */}
          <div className="w-100"></div>
          <div className="col-12 d-flex justify-content-center gap-2 mt-2">
            <button type="submit" className="btn fw-bold px-4" style={{ background: 'linear-gradient(90deg, #6366f1 0%, #312e81 100%)', color: '#fff', borderRadius: 10, fontSize: 17, minWidth: 150 }}>{editingId ? 'Update' : 'Add'} Customer</button>
            {editingId && <button type="button" className="btn btn-secondary px-4" style={{ borderRadius: 10, fontSize: 17, minWidth: 120 }} onClick={() => { setEditingId(null); setForm({ name: '', email: '', phone: '', company: '' }); }}>Cancel</button>}
          </div>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive mb-3">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-primary">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c._id}>
                  <td><Link to={`/customers/${c._id}`}>{c.name}</Link></td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.company}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span>Page: {page} / {Math.ceil(total / 10) || 1}</span>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setPage(p => (p * 10 < total ? p + 1 : p))} disabled={page * 10 >= total}>Next</button>
        </div>
      </div>
    </div>
  );
}
