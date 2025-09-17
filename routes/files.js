const router = require('express').Router();
const fs = require('fs');
const path = require('path');

// VULNERABILITY: Path Traversal
router.get('/download', (req, res) => {
  const filename = req.query.file;
  
  // No validation of file path - allows directory traversal
  const filePath = path.join(__dirname, '../uploads/', filename);
  
  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(404).send('File not found');
    res.send(data);
  });
});

// VULNERABILITY: Arbitrary File Write
router.post('/upload', (req, res) => {
  const { filename, content } = req.body;
  
  // No validation - allows writing to any location
  const filePath = path.join(__dirname, '../uploads/', filename);
  
  fs.writeFile(filePath, content, (err) => {
    if (err) return res.status(500).send('Upload failed');
    res.send('File uploaded successfully');
  });
});

module.exports = router;
