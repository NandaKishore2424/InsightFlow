const db = require('../db/db');

const SentimentResult = {
  create: async (sentimentResult) => {
    const { feedback_id, sentiment, confidence_score } = sentimentResult;
    const result = await db.query(
      'INSERT INTO sentiment_results (feedback_id, sentiment, confidence_score) VALUES ($1, $2, $3) RETURNING *',
      [feedback_id, sentiment, confidence_score]
    );
    return result.rows[0];
  },
  
  findByFeedbackId: async (feedbackId) => {
    const result = await db.query(
      'SELECT * FROM sentiment_results WHERE feedback_id = $1',
      [feedbackId]
    );
    return result.rows[0];
  },
  
  getStats: async () => {
    const result = await db.query(
      `SELECT sentiment, COUNT(*) as count 
       FROM sentiment_results 
       GROUP BY sentiment`
    );
    return result.rows;
  }
};

module.exports = SentimentResult;