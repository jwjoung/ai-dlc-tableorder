const express = require('express');
const cors = require('cors');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Routes
// const authRoutes = require('./routes/authRoutes');       // Unit 1
// const menuRoutes = require('./routes/menuRoutes');       // Unit 1
const orderRoutes = require('./routes/orderRoutes');     // Unit 2
const sseRoutes = require('./routes/sseRoutes');         // Unit 2
// const tableRoutes = require('./routes/tableRoutes');     // Unit 3

// app.use('/api/auth', authRoutes);     // Unit 1
// app.use('/api/menus', menuRoutes);    // Unit 1
app.use('/api/orders', orderRoutes);  // Unit 2
app.use('/api/sse', sseRoutes);       // Unit 2
// app.use('/api/tables', tableRoutes);  // Unit 3

// Health check
app.get('/api/health', (req, res) => {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
