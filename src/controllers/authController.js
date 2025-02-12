const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'imf-super-secret-key-2024';

const generateToken = (user) => {
  if (!user || !user.id) {
    console.error('Invalid user object:', user);
    throw new Error('Invalid user object for token generation');
  }

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role
  };
  if (!payload.id || !payload.username || !payload.role) {
    console.error('Missing required fields in payload:', payload);
    throw new Error('Missing required fields for token generation');
  }
  
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '48h' });
    return token;
  } catch (error) {
    console.error('Token generation/verification error:', error);
    throw new Error('Failed to generate valid token');
  }
};

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const userRole = role === 'admin' ? 'admin' : 'agent';
    const user = await User.create({
      username,
      password,
      role: userRole
    });

    const token = generateToken(user);
    const responseData = {
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      details: error.message 
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    const responseData = {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Failed to login',
      details: error.message 
    });
  }
};

const getMe = async (req, res) => {
  try {   
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        error: 'Invalid token format',
        debug: { receivedToken: req.user }
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        debug: {
          searchedId: req.user.id,
          tokenData: req.user
        }
      });
    }

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      tokenInfo: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Failed to get user details',
      debug: {
        errorMessage: error.message,
        tokenData: req.user
      }
    });
  }
};

module.exports = {
  register,
  login,
  getMe
}; 