const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const tableAuthMiddleware = require('../middleware/tableAuthMiddleware');
const orderController = require('../controllers/orderController');

router.post('/', tableAuthMiddleware, orderController.create);
router.get('/', tableAuthMiddleware, orderController.getBySession);
router.get('/admin', authMiddleware, orderController.getAllAdmin);
router.put('/:id/status', authMiddleware, orderController.updateStatus);
router.delete('/:id', authMiddleware, orderController.remove);

module.exports = router;
