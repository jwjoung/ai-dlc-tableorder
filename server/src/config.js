const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../data/database.sqlite'),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
