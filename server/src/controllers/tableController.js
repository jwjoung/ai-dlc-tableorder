const tableService = require('../services/tableService');

const getAll = (req, res, next) => {
  try {
    const data = tableService.getAllTables(req.admin.storeId);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const create = (req, res, next) => {
  try {
    const data = tableService.createTable(req.admin.storeId, req.body);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
};

const update = (req, res, next) => {
  try {
    const data = tableService.updateTable(Number(req.params.id), req.body);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const complete = (req, res, next) => {
  try {
    const result = tableService.completeTable(Number(req.params.id), req.admin.storeId);

    // SSE broadcast - lazy require to avoid circular deps
    const sseService = require('../services/sseService');
    sseService.broadcast(req.admin.storeId, 'table_completed', {
      tableId: result.tableId,
      tableNumber: result.tableNumber,
    });

    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
};

const getHistory = (req, res, next) => {
  try {
    const dateFilter = {};
    if (req.query.from) dateFilter.from = req.query.from;
    if (req.query.to) dateFilter.to = req.query.to;

    const data = tableService.getTableHistory(
      Number(req.params.id),
      Object.keys(dateFilter).length > 0 ? dateFilter : null
    );
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, update, complete, getHistory };
