const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret-key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.id) {
      return res.status(401).json({ 
        error: 'Invalid token format - missing user ID',
        debug: { decoded }
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', {
      name: error.name,
      message: error.message
    });
    res.status(403).json({ 
      error: 'Invalid token.',
      details: error.message
    });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not found in request' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied. Admin rights required.',
      userRole: req.user.role 
    });
  }
  next();
};

module.exports = { authenticateToken, isAdmin }; 