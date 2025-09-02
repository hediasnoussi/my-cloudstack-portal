require('dotenv').config();

module.exports = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cloudstack_portal'
  },
  cloudstack: {
    apiUrl: process.env.CLOUDSTACK_API_URL || 'http://localhost:8080/client/api',
    apiKey: process.env.CLOUDSTACK_API_KEY || '',
    secretKey: process.env.CLOUDSTACK_SECRET_KEY || '',
    timeout: 30000
  },
  port: process.env.PORT || 3001
}; 