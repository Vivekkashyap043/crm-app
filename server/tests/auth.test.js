const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crm-app-test');
  });

  afterAll(async () => {
    await User.deleteMany({ email: /testuser/i });
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should not register an existing user', async () => {
    await User.create({ name: 'Test User', email: 'testuser2@example.com', passwordHash: 'hash' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'testuser2@example.com', password: 'password123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });
});
