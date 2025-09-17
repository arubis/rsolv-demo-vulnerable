// Test file to verify RSOLV workflow can create PRs automatically
const { execFile } = require('child_process');

function testVulnerability(userInput) {
    // Fixed: Use execFile with arguments array to prevent command injection
    execFile('echo', [userInput], (err, stdout) => {
        if (err) {
            console.error('Error:', err.message);
            return;
        }
        console.log(stdout);
    });
}

module.exports = { testVulnerability };