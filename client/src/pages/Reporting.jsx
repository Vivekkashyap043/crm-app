
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import { useAuth } from '../context/AuthContext';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const statusColors = [
  '#6366f1', // qualified
  '#f59e42', // proposal
  '#3b82f6', // new
  '#22c55e', // won
  '#facc15', // contacted
];

export default function Reporting() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/customers/reports/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        setError('Failed to load analytics');
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  if (loading) return <div className="container py-5 text-center">Loading reports...</div>;
  if (error) return <div className="container py-5 text-center text-danger">{error}</div>;

  // Pie chart: Leads by Status
  const pieLabels = Object.keys(data.leadsByStatus);
  const pieData = Object.values(data.leadsByStatus);
  const pieChart = {
    labels: pieLabels,
    datasets: [
      {
        label: 'Leads by Status',
        data: pieData,
        backgroundColor: statusColors,
      },
    ],
  };

  // Bar chart: Revenue by Lead Status
  const barLabels = Object.keys(data.revenueByStatus);
  const barData = Object.values(data.revenueByStatus);
  const barChart = {
    labels: barLabels,
    datasets: [
      {
        label: 'Revenue by Lead Status',
        data: barData,
        backgroundColor: '#2563eb',
      },
    ],
  };

  // Line chart: Monthly Performance Trends
  const lineLabels = data.monthlyTrends.map(m => m.month);
  const lineData = data.monthlyTrends.map(m => m.value);
  const lineChart = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Monthly Performance',
        data: lineData,
        borderColor: '#f59e42',
        backgroundColor: 'rgba(245, 158, 66, 0.2)',
        tension: 0.4,
        pointBackgroundColor: '#f59e42',
        pointBorderColor: '#fff',
        pointRadius: 5,
      },
    ],
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-1" style={{ fontSize: 36 }}>Reports & Analytics</h1>
      <div className="mb-4 text-muted" style={{ fontSize: 18 }}>Track your business performance and sales metrics</div>
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card p-4 h-100 border-0 shadow-sm" style={{ borderRadius: 14 }}>
            <div className="fw-bold text-uppercase mb-1" style={{ fontSize: 16 }}>Total Revenue</div>
            <div className="d-flex align-items-end gap-2">
              <span className="fw-bold" style={{ fontSize: 28 }}>${data.totalRevenue.toLocaleString()}</span>
              <span className="text-muted">$</span>
            </div>
            <div className="text-secondary" style={{ fontSize: 14 }}>From won deals</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-4 h-100 border-0 shadow-sm" style={{ borderRadius: 14 }}>
            <div className="fw-bold text-uppercase mb-1" style={{ fontSize: 16 }}>Pipeline Value</div>
            <div className="d-flex align-items-end gap-2">
              <span className="fw-bold" style={{ fontSize: 28 }}>${data.pipelineValue.toLocaleString()}</span>
            </div>
            <div className="text-secondary" style={{ fontSize: 14 }}>{Object.values(data.leadsByStatus).reduce((a, b) => a + b, 0) - (data.leadsByStatus['won'] || 0)} active leads</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-4 h-100 border-0 shadow-sm" style={{ borderRadius: 14 }}>
            <div className="fw-bold text-uppercase mb-1" style={{ fontSize: 16 }}>Win Rate</div>
            <div className="d-flex align-items-end gap-2">
              <span className="fw-bold" style={{ fontSize: 28 }}>{data.winRate}%</span>
            </div>
            <div className="text-secondary" style={{ fontSize: 14 }}>Lead conversion rate</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-4 h-100 border-0 shadow-sm" style={{ borderRadius: 14 }}>
            <div className="fw-bold text-uppercase mb-1" style={{ fontSize: 16 }}>Avg Deal Size</div>
            <div className="d-flex align-items-end gap-2">
              <span className="fw-bold" style={{ fontSize: 28 }}>${data.avgDealSize.toLocaleString()}</span>
            </div>
            <div className="text-secondary" style={{ fontSize: 14 }}>Per won deal</div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card p-4 h-100 border-0 shadow-sm" style={{ borderRadius: 14 }}>
            <div className="fw-bold mb-2" style={{ fontSize: 20 }}>Leads by Status</div>
            <Pie data={pieChart} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-4 h-100 border-0 shadow-sm" style={{ borderRadius: 14 }}>
            <div className="fw-bold mb-2" style={{ fontSize: 20 }}>Revenue by Lead Status</div>
            <Bar data={barChart} options={{ plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      <div className="card p-4 border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
        <div className="fw-bold mb-2" style={{ fontSize: 20 }}>Monthly Performance Trends</div>
        <Line data={lineChart} options={{ plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
}
