const menuService = require('../services/menuService');

const getAll = (req, res, next) => {
  try {
    const storeId = req.table ? req.table.storeId : req.admin.storeId;
    const isAdmin = !!req.admin;
    const data = menuService.getAllMenus(storeId, isAdmin);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const getById = (req, res, next) => {
  try {
    const data = menuService.getMenuById(Number(req.params.id));
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const create = (req, res, next) => {
  try {
    const data = menuService.createMenu(req.admin.storeId, req.body);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
};

const update = (req, res, next) => {
  try {
    const data = menuService.updateMenu(Number(req.params.id), req.body);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const remove = (req, res, next) => {
  try {
    menuService.deleteMenu(Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const updateOrder = (req, res, next) => {
  try {
    menuService.updateMenuOrder(Number(req.params.id), req.body.direction);
    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
};

// --- Categories ---

const getCategories = (req, res, next) => {
  try {
    const storeId = req.table ? req.table.storeId : req.admin.storeId;
    const data = menuService.getCategories(storeId);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const createCategory = (req, res, next) => {
  try {
    const data = menuService.createCategory(req.admin.storeId, req.body);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
};

const updateCategory = (req, res, next) => {
  try {
    const data = menuService.updateCategory(Number(req.params.id), req.body);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = (req, res, next) => {
  try {
    menuService.deleteCategory(Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll, getById, create, update, remove, updateOrder,
  getCategories, createCategory, updateCategory, deleteCategory,
};
