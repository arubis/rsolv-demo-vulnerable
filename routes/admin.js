const router = require('express').Router();
const { exec } = require('child_process');

// VULNERABILITY: Command Injection
router.post('/backup', (req, res) => {
  const { directory } = req.body;
  
  // User input directly passed to shell command
  exec(`tar -czf backup.tar.gz ${directory}`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    res.json({ message: 'Backup completed', output: stdout });
  });
});

// VULNERABILITY: Another Command Injection
router.get('/ping', (req, res) => {
  const host = req.query.host;
  
  // Unsafe command execution
  exec(`ping -c 4 ${host}`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    res.send(`<pre>${stdout}</pre>`);
  });
});

module.exports = router;
