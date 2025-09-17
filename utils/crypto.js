const crypto = require('crypto');

// VULNERABILITY: Weak Hashing Algorithm - MD5 is cryptographically broken
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// VULNERABILITY: Insecure Random Number Generation - Math.random() is not cryptographically secure
function generateToken() {
  return Math.random().toString(36).substring(2);
}

// VULNERABILITY: Weak Encryption - createCipher is deprecated and uses weak encryption
function encrypt(text) {
  const cipher = crypto.createCipher('aes128', 'hardcoded-key');
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

// VULNERABILITY: Hardcoded encryption key
const ENCRYPTION_KEY = 'my-secret-key-12345';

module.exports = { hashPassword, generateToken, encrypt, ENCRYPTION_KEY };