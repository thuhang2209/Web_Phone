// routes/index.js
const express = require('express');
const phoneRoutes = require('./phoneRoutes');

const router = express.Router();

// Route root cho /api
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Phone Store API!',
    endpoints: {
      phones: '/api/phones',
      phoneById: '/api/phones/:id'
    }
  });
});

// Gắn route con
router.use('/phones', phoneRoutes);

module.exports = router;
