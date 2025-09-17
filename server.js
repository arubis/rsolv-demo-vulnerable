const express = require('express');
const mysql = require('mysql2');
const { exec } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// VULNERABILITY: Hardcoded database credentials
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin123',  // Hardcoded password
  database: 'demo_db'
};

const db = mysql.createConnection(dbConfig);

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/search', require('./routes/search'));
app.use('/api/files', require('./routes/files'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
