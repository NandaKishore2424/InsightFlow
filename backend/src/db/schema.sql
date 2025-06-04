CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NULL,
  name VARCHAR(100),
  email VARCHAR(100),
  message TEXT NOT NULL,
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