const orderService = require('../services/orderService');

const create = (req, res, next) => {
  try {
    const { items } = req.body;
    const order = orderService.createOrder(
      req.table.storeId,
      req.table.id,
      req.table.sessionId,
      items
    );
    res.status(201).json({ data: order });
  } catch (error) {
    next(error);
  }
};

const getBySession = (req, res, next) => {
  try {
    const orders = orderService.getOrdersBySession(
      req.table.id,
      req.table.sessionId
    );
    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const getAllAdmin = (req, res, next) => {
  try {
    const data = orderService.getAllActiveOrders(req.admin.storeId);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const updateStatus = (req, res, next) => {
  try {
    const { status } = req.body;
    const order = orderService.updateOrderStatus(Number(req.params.id), status);
    res.json({ data: order });
  } catch (error) {
    next(error);
  }
};

const remove = (req, res, next) => {
  try {
    orderService.deleteOrder(Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getBySession, getAllAdmin, updateStatus, remove };
