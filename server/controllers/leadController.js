const Lead = require('../models/Lead');

// Add new lead to a customer
exports.createLead = async (req, res) => {
  try {
    const { title, description, status, value } = req.body;
    const lead = new Lead({
      customerId: req.params.customerId,
      title,
      description,
      status,
      value
    });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all leads for a customer
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ customerId: req.params.customerId });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single lead
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.leadId, req.body, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
