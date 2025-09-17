// Test file for automatic PR creation
const { exec } = require('child_process');

function vulnerableFunction(input) {
    // Command injection vulnerability
    exec(`ls -la ${input}`, (err, stdout) => {
        console.log(stdout);
    });
}

module.exports = { vulnerableFunction };