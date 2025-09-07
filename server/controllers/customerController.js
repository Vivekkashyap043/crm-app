const Customer = require('../models/Customer');
const Lead = require('../models/Lead');

// Add new customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;
    const customer = new Customer({ name, email, phone, company, ownerId: req.user.id });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// List customers with pagination and search
exports.getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };
    const customers = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Customer.countDocuments(query);
    res.json({ customers, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get customer details (with leads)
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const leads = await Lead.find({ customerId: customer._id });
    res.json({ customer, leads });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await Lead.deleteMany({ customerId: req.params.id });
    res.json({ message: 'Customer and associated leads deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
