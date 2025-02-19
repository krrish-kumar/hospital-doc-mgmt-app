const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
// In-memory user store for simplicity; Properly use a DB in production.
const users = [
  // Sample users: password hashed using bcrypt in real scenario.
  { id: 1, hospital: 'City Hospital', userId: 'user1', password: 'password1', role: 'general' },
  { id: 2, hospital: 'City Hospital', userId: 'admin1', password: 'adminpass', role: 'admin' }
];

const SECRET_KEY = 'your_jwt_secret';

// Login route
router.post('/login', [
  body('hospital').notEmpty().withMessage('Hospital name is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { hospital, userId, password } = req.body;

  // Find user; in production, query DB and compare hashed passwords.
  const user = users.find(u => u.hospital.toLowerCase() === hospital.toLowerCase() && u.userId === userId && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate token with hospital and role info
  const token = jwt.sign({ id: user.id, hospital: user.hospital, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;