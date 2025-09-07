const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Lead = require('../models/Lead');

let token;
let customerId;
let leadId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crm-app-test');
  await User.deleteMany({ email: /apitest/i });
  await Customer.deleteMany({ email: /apitest/i });
  await Lead.deleteMany({});
  // Register and login a user
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'API Test', email: 'apitest@example.com', password: 'password123' });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'apitest@example.com', password: 'password123' });
  token = res.body.token;
});

afterAll(async () => {
  await User.deleteMany({ email: /apitest/i });
  await Customer.deleteMany({ email: /apitest/i });
  await Lead.deleteMany({});
  await mongoose.connection.close();
});

describe('Customer API', () => {
  it('should create a customer', async () => {
    const res = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Customer', email: 'customerapitest@example.com', phone: '1234567890', company: 'TestCo' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Customer');
    customerId = res.body._id;
  });

  it('should list customers', async () => {
    const res = await request(app)
      .get('/api/customers')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.customers)).toBe(true);
  });

  it('should get customer by id (with leads)', async () => {
    const res = await request(app)
      .get(`/api/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.customer._id).toBe(customerId);
    expect(Array.isArray(res.body.leads)).toBe(true);
  });

  it('should update a customer', async () => {
    const res = await request(app)
      .put(`/api/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Customer', email: 'customerapitest@example.com', phone: '9876543210', company: 'TestCo' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Customer');
  });
});

describe('Lead API', () => {
  it('should create a lead for the customer', async () => {
    const res = await request(app)
      .post(`/api/customers/${customerId}/leads`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Lead', description: 'Lead desc', status: 'New', value: 1000 });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Lead');
    leadId = res.body._id;
  });

  it('should list leads for the customer', async () => {
    const res = await request(app)
      .get(`/api/customers/${customerId}/leads`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a lead by id', async () => {
    const res = await request(app)
      .get(`/api/customers/${customerId}/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(leadId);
  });

  it('should update a lead', async () => {
    const res = await request(app)
      .put(`/api/customers/${customerId}/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Lead', description: 'Updated desc', status: 'Contacted', value: 2000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Lead');
  });
});

describe('Cleanup', () => {
  it('should delete the lead', async () => {
    const res = await request(app)
      .delete(`/api/customers/${customerId}/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('should not allow non-admin to delete customer', async () => {
    const res = await request(app)
      .delete(`/api/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });
});
