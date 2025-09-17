const express = require('express');
const router = express.Router();
const crypto = require('../utils/crypto');

// VULNERABILITY: SQL Injection - Direct string concatenation in query
router.get('/search', (req, res) => {
  const query = req.query.q;
  const sql = `SELECT * FROM users WHERE name = '${query}'`;

  // Simulate database query
  console.log('Executing SQL:', sql);
  res.json({ message: 'Search results', query: sql });
});

// VULNERABILITY: Command Injection - Unsanitized user input in exec
router.post('/backup', (req, res) => {
  const filename = req.body.filename;
  const command = `tar -czf ${filename}.tar.gz user_data/`;

  require('child_process').exec(command, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ message: 'Backup created', command });
    }
  });
});

// VULNERABILITY: Path Traversal - No validation on file paths
router.get('/profile/:userId/avatar', (req, res) => {
  const userId = req.params.userId;
  const filePath = `./uploads/${userId}`;

  res.sendFile(filePath, { root: __dirname });
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
