const config = require('./config');
const { getDatabase, closeDatabase } = require('./db/database');
const app = require('./app');

// Initialize database
console.log('Initializing database...');
getDatabase();
console.log('Database ready.');

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.close(() => {
    closeDatabase();
    console.log('Server stopped.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
});
