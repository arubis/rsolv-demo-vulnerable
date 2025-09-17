const express = require('express');
const router = express.Router();
const crypto = require('../utils/crypto');

// FIXED: SQL Injection - Using parameterized queries
router.get('/search', (req, res) => {
  const query = req.query.q;

  // Input validation
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid search query' });
  }

  // Use parameterized query to prevent SQL injection
  const sql = 'SELECT * FROM users WHERE name = ?';
  const params = [query];

  // Simulate database query with parameters
  console.log('Executing SQL:', sql, 'Parameters:', params);
  res.json({ message: 'Search results', query: sql, parameters: params });
});

// FIXED: Command Injection - Using execFile with input validation
router.post('/backup', (req, res) => {
  const filename = req.body.filename;

  // Input validation - only allow alphanumeric characters and hyphens
  if (!filename || !/^[\w\-]+$/.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const { execFile } = require('child_process');
  execFile('tar', ['-czf', `${filename}.tar.gz`, 'user_data/'], (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ message: 'Backup created', filename: `${filename}.tar.gz` });
    }
  });
});

// FIXED: Path Traversal - Proper input validation and path sanitization
router.get('/profile/:userId/avatar', (req, res) => {
  const userId = req.params.userId;

  // Input validation - only allow alphanumeric characters
  if (!userId || !/^[\w]+$/.test(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const path = require('path');
  const uploadsDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadsDir, userId);

  // Ensure the resolved path is within the uploads directory
  if (!filePath.startsWith(uploadsDir)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.sendFile(filePath);
});

// VULNERABILITY: Weak password hashing
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Using vulnerable MD5 hashing from crypto utils
  const hashedPassword = crypto.hashPassword(password);

  res.json({
    message: 'User registered',
    username,
    passwordHash: hashedPassword
  });
});

// VULNERABILITY: Insecure session token generation
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Generate insecure token
  const sessionToken = crypto.generateToken();

  res.json({
    message: 'Login successful',
    token: sessionToken,
    expires: Date.now() + 3600000
  });
});

module.exports = router;
