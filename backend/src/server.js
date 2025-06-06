const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const dbTestRoutes = require('./routes/dbTest');
const feedbackRoutes = require('./routes/feedback');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const socketInit = require('./socket/socket');
const errorHandler = require('./middleware/errorHandler');
const { authRateLimiter, generalRateLimiter } = require('./middleware/rateLimiter');
const AppError = require('./utils/AppError');
const db = require('./db/db');
const logger = require('./utils/logger');

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = socketInit.initSocket(server);

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

app.use(helmet());
app.use(cors());
app.use(express.json());

// Setup morgan logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: accessLogStream }));
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to InsightFlow API' });
});

app.use('/api', dbTestRoutes);

// Apply rate limiters
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/feedback', generalRateLimiter, feedbackRoutes);
app.use('/api/analytics', generalRateLimiter, analyticsRoutes);

// Force refresh connections
db.query('SELECT 1');

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(errorHandler);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });
  process.exit(1);
});