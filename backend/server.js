const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead-crm';
mongoose.connect(dbUri)
  .then(() => console.log('Successfully connected to MongoDB Database.'))
  .catch(err => {
    console.error('MongoDB database connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));

// Base route for connectivity test
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Client Lead Management CRM Backend API is running.',
    endpoints: {
      auth: '/api/auth',
      leads: '/api/leads'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in mode on port ${PORT}`);
  });
}

module.exports = app;
