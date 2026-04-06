const sseService = require('../services/sseService');

const streamOrders = (req, res) => {
  sseService.addClient(req, res, req.admin.storeId);
};

module.exports = { streamOrders };
