const express = require('express');
const db = require('../db/db');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const SentimentResult = require('../models/SentimentResult');

const router = express.Router();

router.get('/sentiment', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { days } = req.query;
    
    let queryString = `
      SELECT sentiment, COUNT(*) as count 
      FROM sentiment_results s
      JOIN feedback f ON s.feedback_id = f.id
    `;
    
    const queryParams = [];
    
    if (days) {
      queryString += ` WHERE f.created_at >= NOW() - INTERVAL '${days} days'`;
    }
    
    queryString += ` GROUP BY sentiment`;
    
    const results = await db.query(queryString, queryParams);
    
    const sentimentData = {
      positive: 0,
      negative: 0,
      neutral: 0
    };
    
    results.rows.forEach(row => {
      sentimentData[row.sentiment] = parseInt(row.count);
    });
    
    res.json(sentimentData);
  } catch (err) {
    console.error('Error fetching sentiment stats:', err);
    res.status(500).json({ message: 'Error fetching sentiment statistics' });
  }
});

router.get('/trend', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const queryString = `
      SELECT 
        DATE(f.created_at) as date,
        COUNT(*) as total,
        SUM(CASE WHEN s.sentiment = 'positive' THEN 1 ELSE 0 END) as positive,
        SUM(CASE WHEN s.sentiment = 'negative' THEN 1 ELSE 0 END) as negative,
        SUM(CASE WHEN s.sentiment = 'neutral' THEN 1 ELSE 0 END) as neutral
      FROM 
        feedback f
      JOIN 
        sentiment_results s ON f.id = s.feedback_id
      WHERE 
        f.created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY 
        DATE(f.created_at)
      ORDER BY 
        date ASC
    `;
    
    const results = await db.query(queryString);
    
    res.json(results.rows);
  } catch (err) {
    console.error('Error fetching feedback trend:', err);
    res.status(500).json({ message: 'Error fetching feedback trend data' });
  }
});

module.exports = router;