const db = require('../db/db');

const User = {
  findByEmail: async (email) => {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },
  
  create: async (user) => {
    const { name, email, password_hash, role } = user;
    const result = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password_hash, role || 'user']
    );
    return result.rows[0];
  },
  
  // Add this method for better user management
  findById: async (id) => {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = User;