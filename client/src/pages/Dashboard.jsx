
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const statusColors = {
  active: '#22c55e',
  pending: '#f59e42',
  inactive: '#cbd5e1',
};

export default function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [modalForm, setModalForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [modalId, setModalId] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/customers/dashboard/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data.summary);
      setCustomers(res.data.customers);
    } catch (err) {
      setError('Failed to load dashboard data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, [token]);

  if (loading) return <div className="container py-5 text-center">Loading dashboard...</div>;
  if (error) return <div className="container py-5 text-center text-danger">{error}</div>;

  const summaryCards = [
    { label: 'Total Customers', value: summary.totalCustomers, sub: `${summary.activeCustomers} active`, icon: '👥' },
    { label: 'Total Value', value: `$${summary.totalValue.toLocaleString()}`, sub: 'Across all customers', icon: '$' },
    { label: 'Active Leads', value: summary.activeLeads, sub: `${summary.winRate > 0 ? summary.winRate + '% win rate' : 'No wins yet'}`, icon: '📈' },
    { label: 'Win Rate', value: `${summary.winRate}%`, sub: 'Lead conversion rate', icon: '↗️' },
  ];

  return (
    <div className="container py-4">
      <div className="row g-4 mb-4">
        {summaryCards.map((s, i) => (
          <div className="col-md-3" key={i}>
            <div className="card h-100 p-3 shadow-sm border-0" style={{ borderRadius: 14 }}>
              <div className="d-flex align-items-center gap-3 mb-2">
                <span style={{ fontSize: 28 }}>{s.icon}</span>
                <div>
                  <div className="fw-bold" style={{ fontSize: 22 }}>{s.value}</div>
                  <div className="text-muted" style={{ fontSize: 15 }}>{s.label}</div>
                </div>
              </div>
              <div className="text-secondary" style={{ fontSize: 13 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-0" style={{ fontSize: 28 }}>Customers</h2>
            <div className="text-muted" style={{ fontSize: 16 }}>Manage your customer database</div>
          </div>
          <button className="btn btn-primary fw-bold" style={{ fontSize: 16, borderRadius: 8 }}
            onClick={() => {
              setModalMode('add');
              setModalForm({ name: '', email: '', phone: '', company: '' });
              setModalId(null);
              setShowModal(true);
            }}
          >
            <span style={{ fontSize: 20, marginRight: 6 }}>+</span> Add Customer
          </button>
        </div>
        <div className="mb-3">
          <input className="form-control" style={{ maxWidth: 350 }} placeholder="Search customers..." />
        </div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr style={{ fontSize: 15 }}>
                <th>Customer</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Value</th>
                <th>Leads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i}>
                  <td>
                    <div className="fw-bold">{c.name}</div>
                    <div className="text-muted" style={{ fontSize: 13 }}>Joined {c.joined}</div>
                  </td>
                  <td className="fw-bold">{c.company}</td>
                  <td style={{ fontSize: 15 }}>
                    <div><span className="me-1">📧</span>{c.email}</div>
                    <div><span className="me-1">📞</span>{c.phone}</div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: statusColors[c.status], color: c.status === 'inactive' ? '#222' : '#fff', fontSize: 14, padding: '6px 16px', borderRadius: 12, textTransform: 'lowercase' }}>{c.status}</span>
                  </td>
                  <td className="fw-bold">${c.value.toLocaleString()}</td>
                  <td>{c.leads} lead{c.leads !== 1 ? 's' : ''}</td>
                  <td>
                    <span className="me-2" style={{ cursor: 'pointer', color: '#0ea5e9', fontSize: 18 }} title="View"
                      onClick={() => navigate(`/customers/${c._id || ''}`)}
                    >👁️</span>
                    <span className="me-2" style={{ cursor: 'pointer', color: '#64748b', fontSize: 18 }} title="Edit"
                      onClick={() => {
                        setModalMode('edit');
                        setModalForm({ name: c.name, email: c.email, phone: c.phone, company: c.company });
                        setModalId(c._id);
                        setShowModal(true);
                      }}
                    >✏️</span>
                    <span style={{ cursor: 'pointer', color: '#ef4444', fontSize: 18 }} title="Delete"
                      onClick={async () => {
                        if (window.confirm('Delete this customer?')) {
                          try {
                            await axios.delete(`${API_BASE_URL}/api/customers/${c._id}`, {
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            fetchDashboard();
                          } catch (err) {
                            alert('Error deleting customer');
                          }
                        }
                      }}
                    >🗑️</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Customer */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title={modalMode === 'add' ? 'Add Customer' : 'Edit Customer'}>
        <form onSubmit={async e => {
          e.preventDefault();
          try {
            if (modalMode === 'edit' && modalId) {
              await axios.put(`${API_BASE_URL}/api/customers/${modalId}`, modalForm, {
                headers: { Authorization: `Bearer ${token}` },
              });
            } else {
              await axios.post(`${API_BASE_URL}/api/customers`, modalForm, {
                headers: { Authorization: `Bearer ${token}` },
              });
            }
            setShowModal(false);
            setModalForm({ name: '', email: '', phone: '', company: '' });
            setModalId(null);
            fetchDashboard();
          } catch (err) {
            alert(err.response?.data?.message || 'Error saving customer');
          }
        }}>
          <div className="mb-3">
            <input className="form-control" placeholder="Name" value={modalForm.name} onChange={e => setModalForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="Email" value={modalForm.email} onChange={e => setModalForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="Phone" value={modalForm.phone} onChange={e => setModalForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="Company" value={modalForm.company} onChange={e => setModalForm(f => ({ ...f, company: e.target.value }))} />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary fw-bold">{modalMode === 'add' ? 'Add' : 'Update'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
