const { RateLimiterMemory } = require('rate-limiter-flexible');

const authLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60, // per minute
});

const apiLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 60, // per minute
});

// Rate limiter for authentication routes
const authRateLimiter = async (req, res, next) => {
  try {
    const ipAddr = req.ip;
    await authLimiter.consume(ipAddr);
    next();
  } catch (err) {
    res.status(429).json({
      status: 'error',
      message: 'Too many login attempts, please try again later.'
    });
  }
};

// Rate limiter for general API routes
const generalRateLimiter = async (req, res, next) => {
  try {
    // Rate limit by IP for non-authenticated requests
    // Rate limit by user ID for authenticated requests
    const key = req.user ? req.user.id : req.ip;
    await apiLimiter.consume(key);
    next();
  } catch (err) {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later.'
    });
  }
};

module.exports = {
  authRateLimiter,
  generalRateLimiter
};