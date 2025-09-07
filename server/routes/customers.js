
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const customerController = require('../controllers/customerController');
const leadController = require('../controllers/leadController');
const { validateBody, schemas } = require('../middleware/validate');
const role = require('../middleware/role');
const reportsController = require('../controllers/reportsController');
const dashboardController = require('../controllers/dashboardController');

// Reports & Analytics endpoint
router.get('/reports/analytics', auth, reportsController.getAnalytics);
// Dashboard summary endpoint
router.get('/dashboard/summary', auth, dashboardController.getDashboardSummary);

// Customer routes
router.post('/', auth, validateBody(schemas.customer), customerController.createCustomer);
router.get('/', auth, customerController.getCustomers);
router.get('/:id', auth, customerController.getCustomer);
router.put('/:id', auth, validateBody(schemas.customer), customerController.updateCustomer);
router.delete('/:id', auth, role('Admin'), customerController.deleteCustomer);

// Lead routes (nested under customer)
router.post('/:customerId/leads', auth, validateBody(schemas.lead), leadController.createLead);
router.get('/:customerId/leads', auth, leadController.getLeads);
router.get('/:customerId/leads/:leadId', auth, leadController.getLead);
router.put('/:customerId/leads/:leadId', auth, validateBody(schemas.lead), leadController.updateLead);
router.delete('/:customerId/leads/:leadId', auth, leadController.deleteLead);

module.exports = router;
