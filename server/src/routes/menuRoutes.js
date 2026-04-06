const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const tableAuthMiddleware = require('../middleware/tableAuthMiddleware');
const menuController = require('../controllers/menuController');

// Menu routes
router.get('/menus', tableAuthMiddleware, menuController.getAll);
router.get('/menus/:id', tableAuthMiddleware, menuController.getById);
router.post('/menus', authMiddleware, menuController.create);
router.put('/menus/:id', authMiddleware, menuController.update);
router.delete('/menus/:id', authMiddleware, menuController.remove);
router.put('/menus/:id/order', authMiddleware, menuController.updateOrder);

// Category routes
router.get('/categories', tableAuthMiddleware, menuController.getCategories);
router.post('/categories', authMiddleware, menuController.createCategory);
router.put('/categories/:id', authMiddleware, menuController.updateCategory);
router.delete('/categories/:id', authMiddleware, menuController.deleteCategory);

module.exports = router;
