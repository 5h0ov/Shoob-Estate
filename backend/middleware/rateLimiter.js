import rateLimit from 'express-rate-limit';

// Post-related endpoints limiter (5 requests per 30 seconds)
export const postLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 5, // 5 requests per windowMs
  handler: (req, res, next, options) => {
    const retrySecs = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) || 1;
    res.status(options.statusCode).json({
      success: false,
      message: `Too many requests for post operations. Please try again after ${retrySecs} seconds.`,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat/Message endpoints limiter (20 requests per 30 seconds)
export const chatLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 20, 
  handler: (req, res, next, options) => {
    const retrySecs = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) || 1;
    res.status(options.statusCode).json({
      success: false,
      message: `Too many chat messages. Please try again after ${retrySecs} seconds.`,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints limiter (5 requests per minute)
export const authLimiter = rateLimit({
  windowMs: 15 * 1000, 
  max: 10,
  handler: (req, res, next, options) => {
    const retrySecs = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) || 1;
    res.status(options.statusCode).json({
      success: false,
      message: `Too many authentication attempts. Please try again after ${retrySecs} seconds.`,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  handler: (req, res, next, options) => {
    const retrySecs = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) || 1;
    res.status(options.statusCode).json({
      success: false,
      message: `Too many contact requests. Please try again after ${retrySecs} seconds.`,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter (100 requests per minute)
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 50,
  handler: (req, res, next, options) => {
    const retrySecs = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) || 1;
    res.status(options.statusCode).json({
      success: false,
      message: `Too many requests. Please try again after ${retrySecs} seconds.`,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});