const db = require('../db/db');

const Feedback = {
  create: async (feedback) => {
    const { name, email, message, category, sentiment, confidence_score } = feedback;
    const result = await db.query(
      'INSERT INTO feedback (name, email, message, category, sentiment, confidence_score) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, message, category, sentiment, confidence_score]
    );
    return result.rows[0];
  },
  
  findByEmail: async (email, options = {}) => {
    const { page = 1, limit = 10, category, sentiment, search } = options;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM feedback WHERE email = $1';
    let params = [email];
    let paramIndex = 2;
    
    // Add filters
    if (category && category !== 'all') {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (sentiment && sentiment !== 'all') {
      query += ` AND sentiment = $${paramIndex}`;
      params.push(sentiment);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND (message ILIKE $${paramIndex} OR name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await db.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count);
    
    // Add pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    return {
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      }
    };
  },
  
  findAll: async (options = {}) => {
    const { page = 1, limit = 10, category, sentiment, search } = options;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM feedback WHERE 1=1';
    let params = [];
    let paramIndex = 1;
    
    // Add filters
    if (category && category !== 'all') {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (sentiment && sentiment !== 'all') {
      query += ` AND sentiment = $${paramIndex}`;
      params.push(sentiment);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND (message ILIKE $${paramIndex} OR name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await db.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count);
    
    // Add pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    return {
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      }
    };
  },
  
  getAnalytics: async () => {
    try {
      // Get sentiment distribution
      const sentimentQuery = `
        SELECT sentiment, COUNT(*) as count 
        FROM feedback 
        GROUP BY sentiment
      `;
      const sentimentResult = await db.query(sentimentQuery);
      
      // Get category distribution
      const categoryQuery = `
        SELECT category, COUNT(*) as count 
        FROM feedback 
        GROUP BY category
      `;
      const categoryResult = await db.query(categoryQuery);
      
      // Get total feedback count
      const totalQuery = 'SELECT COUNT(*) as total FROM feedback';
      const totalResult = await db.query(totalQuery);
      
      // Get recent feedback trend (last 7 days)
      const trendQuery = `
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM feedback 
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `;
      const trendResult = await db.query(trendQuery);
      
      return {
        sentimentDistribution: sentimentResult.rows,
        categoryDistribution: categoryResult.rows,
        totalFeedback: parseInt(totalResult.rows[0].total),
        recentTrend: trendResult.rows
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }
};

module.exports = Feedback;