const router = require('express').Router();

// VULNERABILITY: Cross-Site Scripting (XSS)
router.get('/', (req, res) => {
  const searchTerm = req.query.q || '';
  
  // Rendering user input without escaping
  res.send(`
    <html>
      <body>
        <h1>Search Results</h1>
        <p>You searched for: ${searchTerm}</p>
        <div id="results">
          <!-- User input directly inserted into HTML -->
          <script>
            var term = "${searchTerm}";
            document.getElementById('results').innerHTML = 'Searching for: ' + term;
          </script>
        </div>
      </body>
    </html>
  `);
});

module.exports = router;
