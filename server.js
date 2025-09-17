const express = require('express');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fixed route: Command Injection prevented by input validation and safe file operations
app.get('/search', (req, res) => {
    const query = req.query.q;

    // Input validation: only allow alphanumeric characters and spaces
    if (!query || !/^[a-zA-Z0-9\s]+$/.test(query)) {
        return res.status(400).send('Invalid search query. Only alphanumeric characters and spaces allowed.');
    }

    // Safe file search without shell execution
    const dataDir = path.join(__dirname, 'data');
    try {
        const files = fs.readdirSync(dataDir);
        let results = [];

        files.forEach(file => {
            const filePath = path.join(dataDir, file);
            if (fs.statSync(filePath).isFile()) {
                const content = fs.readFileSync(filePath, 'utf8');
                if (content.toLowerCase().includes(query.toLowerCase())) {
                    results.push(`${file}: Found match`);
                }
            }
        });

        res.send(`<pre>${results.join('\n') || 'No results found'}</pre>`);
    } catch (err) {
        res.status(500).send('Search failed');
    }
});

// Fixed route: Path Traversal prevented by input sanitization
app.get('/file', (req, res) => {
    const filename = req.query.name;

    // Input validation: only allow safe filenames
    if (!filename || !/^[a-zA-Z0-9._-]+$/.test(filename)) {
        return res.status(400).send('Invalid filename. Only alphanumeric characters, dots, underscores, and hyphens allowed.');
    }

    // Prevent path traversal by resolving and validating the path
    const uploadsDir = path.resolve(__dirname, 'uploads');
    const filepath = path.resolve(uploadsDir, filename);

    // Ensure the resolved path is within the uploads directory
    if (!filepath.startsWith(uploadsDir + path.sep)) {
        return res.status(403).send('Access denied: Path traversal detected');
    }

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.send(data);
    });
});

// Fixed route: SQL Injection prevented by parameterized queries
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Invalid username or password format' });
    }

    try {
        // Parameterized query prevents SQL injection
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'dbuser',
            password: 'dbpass',
            database: 'myapp'
        });

        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        await connection.end();

        if (rows.length > 0) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
});

// Fixed route: XSS prevented by HTML escaping
app.post('/comment', (req, res) => {
    const comment = req.body.comment;

    // Input validation
    if (!comment || typeof comment !== 'string') {
        return res.status(400).send('Invalid comment');
    }

    // HTML escape function to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const safeComment = escapeHtml(comment);

    res.send(`
        <html>
            <body>
                <h1>Your Comment:</h1>
                <div>${safeComment}</div>
            </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});