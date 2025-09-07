import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';
import { useAuth } from '../context/AuthContext';

export default function CustomerDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [leads, setLeads] = useState([]);
  const [leadForm, setLeadForm] = useState({ title: '', description: '', status: 'New', value: '' });
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [error, setError] = useState('');

  const fetchCustomer = async () => {
    try {
  const res = await axios.get(`${API_BASE_URL}/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomer(res.data.customer);
      setLeads(res.data.leads);
    } catch (err) {
      setError('Failed to fetch customer details');
    }
  };

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line
  }, [id]);

  const handleLeadChange = e => setLeadForm({ ...leadForm, [e.target.name]: e.target.value });

  const handleLeadSubmit = async e => {
    e.preventDefault();
    try {
      if (editingLeadId) {
  await axios.put(`${API_BASE_URL}/api/customers/${id}/leads/${editingLeadId}`, leadForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
  await axios.post(`${API_BASE_URL}/api/customers/${id}/leads`, leadForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setLeadForm({ title: '', description: '', status: 'New', value: '' });
      setEditingLeadId(null);
      fetchCustomer();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving lead');
    }
  };

  const handleEditLead = lead => {
    setLeadForm({ title: lead.title, description: lead.description, status: lead.status, value: lead.value });
    setEditingLeadId(lead._id);
  };

  const handleDeleteLead = async leadId => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/customers/${id}/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCustomer();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting lead');
    }
  };

  if (!customer) return <div className="container py-5 text-center">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="card p-5 shadow-lg border-0 mx-auto mb-4" style={{ maxWidth: 700, background: '#fff', borderRadius: 18 }}>
        <h1 className="mb-4 fw-bold" style={{ color: '#312e81', fontSize: 32 }}>Customer Detail</h1>
        <div className="mb-2"><b>Name:</b> {customer.name}</div>
        <div className="mb-2"><b>Email:</b> {customer.email}</div>
        <div className="mb-2"><b>Phone:</b> {customer.phone}</div>
        <div className="mb-2"><b>Company:</b> {customer.company}</div>
      </div>
      <div className="card p-4 shadow-lg border-0 mx-auto" style={{ maxWidth: 900, background: '#fff', borderRadius: 18 }}>
        <h2 className="mb-4 fw-bold" style={{ color: '#312e81', fontSize: 26 }}>Leads</h2>
        <form className="row g-2 mb-4" onSubmit={handleLeadSubmit}>
          <div className="col-md-3">
            <input name="title" className="form-control" placeholder="Title" value={leadForm.title} onChange={handleLeadChange} required />
          </div>
          <div className="col-md-3">
            <input name="description" className="form-control" placeholder="Description" value={leadForm.description} onChange={handleLeadChange} />
          </div>
          <div className="col-md-2">
            <select name="status" className="form-select" value={leadForm.status} onChange={handleLeadChange}>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div className="col-md-2">
            <input name="value" type="number" className="form-control" placeholder="Value" value={leadForm.value} onChange={handleLeadChange} />
          </div>
          <div className="col-md-2 d-flex gap-2">
            <button type="submit" className="btn fw-bold" style={{ background: 'linear-gradient(90deg, #6366f1 0%, #312e81 100%)', color: '#fff' }}>{editingLeadId ? 'Update' : 'Add'} Lead</button>
            {editingLeadId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingLeadId(null); setLeadForm({ title: '', description: '', status: 'New', value: '' }); }}>Cancel</button>}
          </div>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-primary">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l._id}>
                  <td>{l.title}</td>
                  <td>{l.description}</td>
                  <td>{l.status}</td>
                  <td>{l.value}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditLead(l)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteLead(l._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
