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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


module.exports = app;
