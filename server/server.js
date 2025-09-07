require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Import and use routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));


if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error('MongoDB connection error:', err));
}


// Serve static files from the React app in production

app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve React app for all non-API routes
app.get(/^\/(?!api).*/, (req, res, next) => {
  const indexPath = path.join(__dirname, '../client/dist/index.html');
  res.sendFile(indexPath, function(err) {
    if (err) {
      next(err);
    }
  });
});

// 404 handler for unknown API or static routes
app.use((req, res, next) => {
  // If it's an API route, return JSON 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  // For frontend, serve a custom 404.html if it exists, else send text
  const notFoundPath = path.join(__dirname, '../client/dist/404.html');
  res.status(404);
  res.sendFile(notFoundPath, err => {
    if (err) {
      res.type('text/plain').send('404: Page Not Found');
    }
  });
});


module.exports = app;
