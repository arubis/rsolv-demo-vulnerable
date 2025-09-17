const router = require('express').Router();
const fs = require('fs');
const path = require('path');

// FIXED: Path Traversal - Proper input validation and path sanitization
router.get('/download', (req, res) => {
  const filename = req.query.file;

  // Input validation - only allow safe filenames
  if (!filename || !/^[\w.\-]+$/.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const uploadsDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadsDir, filename);

  // Ensure the resolved path is within the uploads directory
  if (!filePath.startsWith(uploadsDir)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(404).send('File not found');
    res.send(data);
  });
});

// FIXED: Arbitrary File Write - Proper input validation and path restriction
router.post('/upload', (req, res) => {
  const { filename, content } = req.body;

  // Input validation - only allow safe filenames
  if (!filename || !/^[\w.\-]+$/.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  // Validate content
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Invalid file content' });
  }

  const uploadsDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadsDir, filename);

  // Ensure the resolved path is within the uploads directory
  if (!filePath.startsWith(uploadsDir)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  fs.writeFile(filePath, content, (err) => {
    if (err) return res.status(500).send('Upload failed');
    res.send('File uploaded successfully');
  });
});

module.exports = router;
