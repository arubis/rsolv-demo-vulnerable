const router = require('express').Router();
const { execFile } = require('child_process');
const path = require('path');

// FIXED: Command Injection - Using execFile with argument validation
router.post('/backup', (req, res) => {
  const { directory } = req.body;

  // Input validation - only allow alphanumeric, dots, slashes, and hyphens
  if (!directory || !/^[\w./\-]+$/.test(directory)) {
    return res.status(400).json({ error: 'Invalid directory name' });
  }

  // Use execFile instead of exec to prevent shell injection
  execFile('tar', ['-czf', 'backup.tar.gz', directory], (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    res.json({ message: 'Backup completed', output: stdout });
  });
});

// FIXED: Command Injection - Using execFile with input validation
router.get('/ping', (req, res) => {
  const host = req.query.host;

  // Input validation - only allow valid hostnames/IPs
  if (!host || !/^[\w.-]+$/.test(host)) {
    return res.status(400).json({ error: 'Invalid hostname' });
  }

  // Use execFile instead of exec to prevent shell injection
  execFile('ping', ['-c', '4', host], (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    // HTML escape output to prevent XSS
    const escapedOutput = stdout.replace(/[&<>"']/g, (match) => {
      const escape = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return escape[match];
    });
    res.send(`<pre>${escapedOutput}</pre>`);
  });
});

module.exports = router;
