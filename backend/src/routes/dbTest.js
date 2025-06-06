const express = require('express');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

const router = express.Router();

router.get('/test-db', async (req, res) => {
  try {
    const admin = await User.findByEmail('admin@insightflow.com');
    
    if (admin) {
      res.json({
        success: true,
        message: 'Database connection successful',
        data: { admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Admin user not found. Database might not be properly initialized.'
      });
    }
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: err.message
    });
  }
});

module.exports = router;