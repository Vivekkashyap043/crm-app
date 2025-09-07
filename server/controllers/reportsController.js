const Customer = require('../models/Customer');
const Lead = require('../models/Lead');

exports.getAnalytics = async (req, res) => {
  try {
    // All leads
    const leads = await Lead.find();
    // Revenue (won deals)
    const wonLeads = leads.filter(l => l.status === 'Converted');
    const totalRevenue = wonLeads.reduce((sum, l) => sum + (l.value || 0), 0);
    // Pipeline value (active leads)
    const activeLeads = leads.filter(l => l.status !== 'Lost');
    const pipelineValue = activeLeads.reduce((sum, l) => sum + (l.value || 0), 0);
    // Win rate
    const winRate = leads.length ? ((wonLeads.length / leads.length) * 100).toFixed(1) : '0.0';
    // Avg deal size
    const avgDealSize = wonLeads.length ? (totalRevenue / wonLeads.length).toFixed(0) : 0;

    // Leads by status
    const statusList = ['qualified', 'proposal', 'new', 'won', 'contacted'];
    const leadsByStatus = {};
    statusList.forEach(s => { leadsByStatus[s] = 0; });
    leads.forEach(l => {
      const status = (l.status || '').toLowerCase();
      if (leadsByStatus[status] !== undefined) leadsByStatus[status]++;
    });

    // Revenue by lead status
    const revenueByStatus = {};
    statusList.forEach(s => { revenueByStatus[s] = 0; });
    leads.forEach(l => {
      const status = (l.status || '').toLowerCase();
      if (revenueByStatus[status] !== undefined) revenueByStatus[status] += (l.value || 0);
    });

    // Monthly performance trends (mocked for now)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyTrends = months.map((m, i) => ({
      month: m,
      value: 80000 + i * 40000
    }));

    res.json({
      totalRevenue,
      pipelineValue,
      winRate,
      avgDealSize,
      leadsByStatus,
      revenueByStatus,
      monthlyTrends,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};