const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vulnerable route: Command Injection
app.get('/search', (req, res) => {
    const query = req.query.q;
    // VULNERABILITY: Unsanitized user input in shell command
    exec(`grep -r "${query}" ./data/`, (err, stdout) => {
        if (err) {
            return res.status(500).send('Search failed');
        }
        res.send(`<pre>${stdout}</pre>`);
    });
});

// Vulnerable route: Path Traversal
app.get('/file', (req, res) => {
    const filename = req.query.name;
    // VULNERABILITY: No path sanitization
    const filepath = path.join(__dirname, 'uploads', filename);

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.send(data);
    });
});

// Vulnerable route: SQL Injection (simulated)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // VULNERABILITY: String concatenation in SQL query
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

    // Simulated database query
    res.json({
        message: 'Login attempt',
        debug: query // Exposing query for demo purposes
    });
});

// Vulnerable route: Cross-Site Scripting (XSS)
app.post('/comment', (req, res) => {
    const comment = req.body.comment;
    // VULNERABILITY: Unescaped user input in HTML
    res.send(`
        <html>
            <body>
                <h1>Your Comment:</h1>
                <div>${comment}</div>
            </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});