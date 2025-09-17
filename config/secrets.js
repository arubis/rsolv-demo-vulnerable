// VULNERABILITY: Hardcoded API Keys and Secrets
module.exports = {
  // Hardcoded API keys
  stripeApiKey: 'sk_live_abcdef123456789',
  twilioApiKey: 'AC1234567890abcdef',
  twilioSecret: 'secret123456789',
  
  // Hardcoded JWT secret
  jwtSecret: 'my-super-secret-jwt-key',
  
  // Hardcoded encryption key
  encryptionKey: 'this-is-a-32-char-encryption-key!',
  
  // AWS credentials (never do this!)
  awsAccessKey: 'AKIAIOSFODNN7EXAMPLE',
  awsSecretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
};
