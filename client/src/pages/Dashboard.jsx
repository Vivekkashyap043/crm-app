
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  active: '#22c55e',
  pending: '#f59e42',
  inactive: '#cbd5e1',
};

export default function Dashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
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
          <button className="btn btn-primary fw-bold" style={{ fontSize: 16, borderRadius: 8 }}>
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
                    <span className="me-2" style={{ cursor: 'pointer', color: '#0ea5e9', fontSize: 18 }} title="View">👁️</span>
                    <span className="me-2" style={{ cursor: 'pointer', color: '#64748b', fontSize: 18 }} title="Edit">✏️</span>
                    <span style={{ cursor: 'pointer', color: '#ef4444', fontSize: 18 }} title="Delete">🗑️</span>
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
