CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  message TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  sentiment VARCHAR(20) DEFAULT 'neutral',
  confidence_score DECIMAL(5,4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sentiment_results (
  id SERIAL PRIMARY KEY,
  feedback_id INTEGER REFERENCES feedback(id) NOT NULL,
  sentiment VARCHAR(20) NOT NULL,
  confidence_score FLOAT NOT NULL
);

INSERT INTO users (name, email, password_hash, role) 
VALUES ('Admin', 'admin@insightflow.com', '$2b$10$rPQcqS9HHvCV/Hc0mJiAOeNX3s6jHiS7uIoc5Yh0cqtVmHM0lMKX.', 'admin');

-- Add index for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);
CREATE INDEX idx_feedback_email ON feedback(email);
CREATE INDEX idx_sentiment_results_sentiment ON sentiment_results(sentiment);
CREATE INDEX idx_feedback_category ON feedback(category);