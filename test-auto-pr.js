// Test file for automatic PR creation
const { exec } = require('child_process');
const path = require('path');

function vulnerableFunction(input) {
    // Fixed: Validate and sanitize input to prevent command injection
    if (!input || typeof input !== 'string') {
        console.error('Invalid input provided');
        return;
    }

    // Remove dangerous characters and validate path
    const sanitizedInput = path.normalize(input).replace(/[;&|`$(){}[\]]/g, '');

    // Additional validation: ensure it's a valid path component
    if (sanitizedInput !== input || sanitizedInput.includes('..')) {
        console.error('Potentially malicious input detected');
        return;
    }

    exec(`ls -la ${sanitizedInput}`, (err, stdout) => {
        if (err) {
            console.error('Command execution failed:', err.message);
            return;
        }
        console.log(stdout);
    });
}

module.exports = { vulnerableFunction };