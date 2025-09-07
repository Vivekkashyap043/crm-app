const Customer = require('../models/Customer');
const Lead = require('../models/Lead');

exports.getDashboardSummary = async (req, res) => {
  try {
    // Customers
    const customers = await Customer.find();
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status !== 'inactive').length;

    // Leads
    const leads = await Lead.find();
    const activeLeads = leads.filter(l => l.status !== 'Lost').length;
    const wonLeads = leads.filter(l => l.status === 'Converted').length;
    const winRate = leads.length ? ((wonLeads / leads.length) * 100).toFixed(1) : '0.0';

    // Total value
    const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);

    // Customer table data
    const customerTable = await Promise.all(customers.map(async c => {
      const custLeads = leads.filter(l => l.customerId.toString() === c._id.toString());
      const value = custLeads.reduce((sum, l) => sum + (l.value || 0), 0);
      const status = c.status || (custLeads.some(l => l.status === 'Converted') ? 'active' : 'inactive');
      return {
        id: c._id,
        name: c.name,
        company: c.company,
        email: c.email,
        phone: c.phone,
        status,
        value,
        leads: custLeads.length,
        joined: c.createdAt ? c.createdAt.toLocaleDateString() : '',
      };
    }));

    res.json({
      summary: {
        totalCustomers,
        activeCustomers,
        totalValue,
        activeLeads,
        winRate,
      },
      customers: customerTable,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};