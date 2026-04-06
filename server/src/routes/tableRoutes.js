const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const tableController = require('../controllers/tableController');

router.get('/', authMiddleware, tableController.getAll);
router.post('/', authMiddleware, tableController.create);
router.put('/:id', authMiddleware, tableController.update);
router.post('/:id/complete', authMiddleware, tableController.complete);
router.get('/:id/history', authMiddleware, tableController.getHistory);

module.exports = router;
