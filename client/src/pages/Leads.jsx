
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  New: '#3b82f6',
  Contacted: '#facc15',
  Converted: '#22c55e',
  Lost: '#ef4444',
};
const statusList = ['New', 'Contacted', 'Converted', 'Lost'];

export default function Leads() {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ customerId: '', title: '', description: '', status: 'New', value: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // For delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLead, setDeleteLead] = useState(null);

  // Fetch all customers and all leads
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const custRes = await axios.get(`${API_BASE_URL}/api/customers?limit=1000`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(custRes.data.customers);
        let allLeads = [];
        for (const c of custRes.data.customers) {
          const detailRes = await axios.get(`${API_BASE_URL}/api/customers/${c._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          for (const l of detailRes.data.leads) {
            allLeads.push({ ...l, customer: c });
          }
        }
        setLeads(allLeads);
      } catch (err) {
        setError('Failed to load leads');
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Only send allowed fields in body
      const leadData = {
        title: form.title,
        description: form.description,
        status: form.status,
        value: form.value,
      };
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/customers/${form.customerId}/leads/${editingId}`, leadData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/customers/${form.customerId}/leads`, leadData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ customerId: '', title: '', description: '', status: 'New', value: '' });
      setEditingId(null);
      // Refresh
      setLoading(true);
      const custRes = await axios.get(`${API_BASE_URL}/api/customers?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(custRes.data.customers);
      let allLeads = [];
      for (const c of custRes.data.customers) {
        const detailRes = await axios.get(`${API_BASE_URL}/api/customers/${c._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        for (const l of detailRes.data.leads) {
          allLeads.push({ ...l, customer: c });
        }
      }
      setLeads(allLeads);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving lead');
    }
  };

  const handleEdit = lead => {
    setForm({
      customerId: lead.customer._id,
      title: lead.title,
      description: lead.description,
      status: lead.status,
      value: lead.value,
    });
    setEditingId(lead._id);
  };

  const handleDelete = lead => {
    setDeleteLead(lead);
    setShowDeleteModal(true);
  };

  const filteredLeads = filter ? leads.filter(l => l.status === filter) : leads;

  return (
    <div className="container py-5">
      <div className="card p-5 shadow-lg border-0 mx-auto mb-4" style={{ maxWidth: 1200, background: '#fff', borderRadius: 18 }}>
        <h1 className="mb-4 fw-bold" style={{ color: '#312e81', fontSize: 32 }}>Leads</h1>
        <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
          <select className="form-select" style={{ maxWidth: 220 }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {statusList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn btn-secondary" onClick={() => setFilter('')}>Clear Filter</button>
        </div>
        <form className="row g-2 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <select name="customerId" className="form-select" value={form.customerId} onChange={handleChange} required>
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <input name="title" className="form-control" placeholder="Title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input name="description" className="form-control" placeholder="Description" value={form.description} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <select name="status" className="form-select" value={form.status} onChange={handleChange}>
              {statusList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <input name="value" type="number" className="form-control" placeholder="Value" value={form.value} onChange={handleChange} />
          </div>
          {/* Button row below, centered */}
          <div className="w-100"></div>
          <div className="col-12 d-flex justify-content-center gap-2 mt-2">
            <button
              type="submit"
              className="btn fw-bold px-4"
              style={{
                background: editingId
                  ? 'linear-gradient(90deg, #f59e42 0%, #fbbf24 100%)'
                  : 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 17,
                minWidth: 150,
                boxShadow: '0 2px 8px rgba(34,197,94,0.10)',
                transition: 'background 0.2s',
                height: 44
              }}
            >
              {editingId ? 'Update' : 'Add'} Lead
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary px-4"
                style={{ borderRadius: 10, fontSize: 17, minWidth: 120, height: 44 }}
                onClick={() => {
                  setEditingId(null);
                  setForm({ customerId: '', title: '', description: '', status: 'New', value: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-primary">
              <tr>
                <th>Customer</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Value</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(l => (
                <tr key={l._id}>
                  <td>{l.customer?.name}</td>
                  <td>{l.title}</td>
                  <td>{l.description}</td>
                  <td>
                    <span className="badge" style={{ background: statusColors[l.status], color: '#fff', fontSize: 14, padding: '6px 16px', borderRadius: 12 }}>{l.status}</span>
                  </td>
                  <td>${l.value?.toLocaleString()}</td>
                  <td>{l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(l)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(l)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      {/* Modal for Delete Confirmation */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Lead">
        <div className="mb-3">Are you sure you want to delete <b>{deleteLead?.title}</b> for customer <b>{deleteLead?.customer?.name}</b>?</div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button type="button" className="btn btn-danger fw-bold" onClick={async () => {
            if (!deleteLead) return;
            try {
              await axios.delete(`${API_BASE_URL}/api/customers/${deleteLead.customer._id}/leads/${deleteLead._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setLeads(leads.filter(l => l._id !== deleteLead._id));
              setShowDeleteModal(false);
              setDeleteLead(null);
            } catch (err) {
              setError(err.response?.data?.message || 'Error deleting lead');
            }
          }}>Delete</button>
        </div>
      </Modal>
      </div>
    </div>
  );
}
