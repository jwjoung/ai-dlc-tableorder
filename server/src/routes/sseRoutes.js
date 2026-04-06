const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { streamOrders } = require('../controllers/sseController');

// SSE doesn't send Authorization header easily, so support token as query param
router.get('/orders', (req, res, next) => {
  // If token in query, set it as Authorization header for authMiddleware
  if (req.query.token && !req.headers.authorization) {
    req.headers.authorization = `Bearer ${req.query.token}`;
  }
  next();
}, authMiddleware, streamOrders);

module.exports = router;
