// Secret key for JWT (only used for minimal session management)
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key-here'

// Google OAuth client configuration
export const GOOGLE_CONFIG = {
  CLIENT_ID: 'YOUR_CLIENT_ID',
  CLIENT_SECRET: 'YOUR_CLIENT_SECRET',
  REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/login',
  TOKEN_URL: 'https://oauth2.googleapis.com/token',
  USERINFO_URL: 'https://www.googleapis.com/oauth2/v3/userinfo',
}
