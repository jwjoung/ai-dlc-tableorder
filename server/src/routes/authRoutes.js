const express = require('express');
const router = express.Router();
const { rateLimiter } = require('../middleware/rateLimiter');
const { adminLogin, tableLogin, verify } = require('../controllers/authController');

router.post('/admin/login', rateLimiter, adminLogin);
router.post('/table/login', rateLimiter, tableLogin);
router.post('/verify', verify);

module.exports = router;
