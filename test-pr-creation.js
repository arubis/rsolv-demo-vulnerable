// Test file to verify RSOLV workflow can create PRs automatically
const { exec } = require('child_process');

function testVulnerability(userInput) {
    // Command injection vulnerability for testing
    exec(`echo ${userInput}`, (err, stdout) => {
        console.log(stdout);
    });
}

module.exports = { testVulnerability };