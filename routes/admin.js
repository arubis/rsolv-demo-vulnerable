const router = require('express').Router();
const { execFile } = require('child_process');
const path = require('path');

// FIXED: Command Injection prevented using execFile with separate arguments
router.post('/backup', (req, res) => {
  const { directory } = req.body;

  // Input validation
  if (!directory || typeof directory !== 'string') {
    return res.status(400).json({ error: 'Invalid directory parameter' });
  }

  // Sanitize directory path to prevent path traversal
  const sanitizedDirectory = path.resolve(directory);

  // Use execFile with separate arguments to prevent command injection
  execFile('tar', ['-czf', 'backup.tar.gz', sanitizedDirectory], (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: 'Backup failed' });
    res.json({ message: 'Backup completed', output: stdout });
  });
});

// FIXED: Command Injection prevented using execFile with input validation
router.get('/ping', (req, res) => {
  const { host } = req.query;

  // Input validation - only allow valid hostnames/IPs
  if (!host || typeof host !== 'string') {
    return res.status(400).json({ error: 'Invalid host parameter' });
  }

  // Sanitize hostname - allow only alphanumeric, dots, hyphens
  const hostnameRegex = /^[a-zA-Z0-9.-]+$/;
  if (!hostnameRegex.test(host) || host.length > 253) {
    return res.status(400).json({ error: 'Invalid hostname format' });
  }

  // Use execFile with separate arguments to prevent command injection
  execFile('ping', ['-c', '4', host], (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: 'Ping failed' });
    res.send(`<pre>${stdout}</pre>`);
  });
});

module.exports = router;
