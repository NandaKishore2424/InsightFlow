const express = require('express');
const Feedback = require('../models/Feedback');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Submit feedback (public route) - Changed from '/' to '/submit'
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message, category = 'general' } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    // Basic sentiment analysis (you can integrate with AI service later)
    const sentiment = message.toLowerCase().includes('good') || 
                     message.toLowerCase().includes('great') || 
                     message.toLowerCase().includes('excellent') ? 'positive' :
                     message.toLowerCase().includes('bad') || 
                     message.toLowerCase().includes('terrible') || 
                     message.toLowerCase().includes('awful') ? 'negative' : 'neutral';
    
    const confidence_score = Math.random() * 0.3 + 0.7; // Random confidence between 0.7-1.0
    
    const feedback = await Feedback.create({
      name,
      email,
      message,
      category,
      sentiment,
      confidence_score
    });
    
    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      feedback 
    });
    
  } catch (err) {
    console.error('Feedback submission error:', err);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

// Get user's own feedback (protected route)
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const { email } = req.query;
    const { page = 1, limit = 10, category, sentiment, search } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }
    
    const feedback = await Feedback.findByEmail(email, {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      sentiment,
      search
    });
    
    res.json({
      data: feedback.data,
      pagination: feedback.pagination
    });
    
  } catch (err) {
    console.error('Error fetching user feedback:', err);
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

// Get all feedback (admin only)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    const { page = 1, limit = 10, category, sentiment, search } = req.query;
    
    const feedback = await Feedback.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      sentiment,
      search
    });
    
    res.json({
      data: feedback.data,
      pagination: feedback.pagination
    });
    
  } catch (err) {
    console.error('Error fetching admin feedback:', err);
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

// Get feedback analytics (admin only)
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    const analytics = await Feedback.getAnalytics();
    
    res.json(analytics);
    
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

module.exports = router;