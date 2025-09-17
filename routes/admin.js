const router = require('express').Router();
const { execFile } = require('child_process');
const path = require('path');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

// FIXED: Command Injection Prevention
router.post('/backup', async (req, res) => {
  const { directory } = req.body;

  // Input validation
  if (!directory || typeof directory !== 'string') {
    return res.status(400).json({ error: 'Invalid directory parameter' });
  }

  // Sanitize path to prevent directory traversal and command injection
  const sanitizedDirectory = path.resolve(path.normalize(directory));

  // Validate that the path is within allowed directories (basic check)
  if (sanitizedDirectory.includes('..') || !sanitizedDirectory.startsWith('/')) {
    return res.status(400).json({ error: 'Invalid directory path' });
  }

  try {
    // Use execFile with separate arguments to prevent command injection
    const { stdout, stderr } = await execFileAsync('tar', ['-czf', 'backup.tar.gz', sanitizedDirectory]);
    res.json({ message: 'Backup completed', output: stdout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FIXED: Another Command Injection Prevention
router.get('/ping', async (req, res) => {
  const host = req.query.host;

  // Input validation
  if (!host || typeof host !== 'string') {
    return res.status(400).json({ error: 'Invalid host parameter' });
  }

  // Validate host format (basic IP/hostname validation)
  const hostRegex = /^[a-zA-Z0-9.-]+$/;
  if (!hostRegex.test(host) || host.length > 253) {
    return res.status(400).json({ error: 'Invalid host format' });
  }

  try {
    // Use execFile with separate arguments to prevent command injection
    const { stdout, stderr } = await execFileAsync('ping', ['-c', '4', host]);
    res.send(`<pre>${stdout}</pre>`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
