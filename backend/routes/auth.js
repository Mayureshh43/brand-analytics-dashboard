import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { auth, authorize } from '../middleware/auth.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// Enhanced validation rules

const loginValidation = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
    
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ max: 100 }).withMessage('Password must not exceed 100 characters')
];

// Rate limiting simulation (simple version)
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_TIMEOUT = 15 * 60 * 1000; // 15 minutes

const checkRateLimit = (ip) => {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || [];
  
  // Remove old attempts
  const recentAttempts = attempts.filter(time => now - time < LOGIN_TIMEOUT);
  
  if (recentAttempts.length >= MAX_LOGIN_ATTEMPTS) {
    return false; // Rate limited
  }
  
  recentAttempts.push(now);
  loginAttempts.set(ip, recentAttempts);
  return true;
};

// Login with rate limiting
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    // Check rate limiting
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please try again in 15 minutes.'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

export default router;