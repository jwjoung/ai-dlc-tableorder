const bcrypt = require('bcryptjs');
const tableRepository = require('../repositories/tableRepository');
const sessionRepository = require('../repositories/sessionRepository');
const orderHistoryRepository = require('../repositories/orderHistoryRepository');
const { AppError } = require('../middleware/errorHandler');
const { getDatabase } = require('../db/database');

class TableService {
  getAllTables(storeId) {
    return tableRepository.getAllTables(storeId);
  }

  createTable(storeId, data) {
    if (!data.tableNumber || data.tableNumber < 1) {
      throw new AppError('테이블 번호를 입력해주세요', 400, 'VALIDATION_ERROR');
    }
    if (!data.password || data.password.length < 4) {
      throw new AppError('비밀번호는 4자 이상이어야 합니다', 400, 'VALIDATION_ERROR');
    }

    const existing = tableRepository.findByStoreAndNumber(storeId, data.tableNumber);
    if (existing) {
      throw new AppError('이미 존재하는 테이블 번호입니다', 409, 'CONFLICT');
    }

    const passwordHash = bcrypt.hashSync(data.password, 10);
    const table = tableRepository.createTable(storeId, data.tableNumber, passwordHash);

    // Create initial session
    sessionRepository.createSession(table.id);

    return table;
  }

  updateTable(tableId, data) {
    const table = tableRepository.getTableById(tableId);
    if (!table) {
      throw new AppError('테이블을 찾을 수 없습니다', 404, 'NOT_FOUND');
    }

    if (!data.tableNumber || data.tableNumber < 1) {
      throw new AppError('테이블 번호를 입력해주세요', 400, 'VALIDATION_ERROR');
    }

    const duplicate = tableRepository.findByStoreAndNumber(table.store_id, data.tableNumber, tableId);
    if (duplicate) {
      throw new AppError('이미 존재하는 테이블 번호입니다', 409, 'CONFLICT');
    }

    const updateData = { table_number: data.tableNumber };
    if (data.password && data.password.length >= 4) {
      updateData.password_hash = bcrypt.hashSync(data.password, 10);
    }

    return tableRepository.updateTable(tableId, updateData);
  }

  completeTable(tableId, storeId) {
    const table = tableRepository.getTableById(tableId);
    if (!table) {
      throw new AppError('테이블을 찾을 수 없습니다', 404, 'NOT_FOUND');
    }

    const session = sessionRepository.getActiveSession(tableId);
    if (!session) {
      throw new AppError('활성 세션이 없습니다', 400, 'VALIDATION_ERROR');
    }

    // Get all orders for this session
    const db = getDatabase();
    const orders = db.prepare(
      'SELECT * FROM orders WHERE table_id = ? AND session_id = ?'
    ).all(tableId, session.id);

    const itemStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    const ordersWithItems = orders.map(o => ({
      ...o,
      items: itemStmt.all(o.id),
    }));

    // Move to history and clean up
    if (ordersWithItems.length > 0) {
      orderHistoryRepository.moveOrdersToHistory(ordersWithItems, table.table_number);
    }

    // End current session
    sessionRepository.endSession(session.id);

    // SSE broadcast will be done by controller (needs sseService)
    return { tableId, tableNumber: table.table_number };
  }

  getTableHistory(tableId, dateFilter) {
    const table = tableRepository.getTableById(tableId);
    if (!table) {
      throw new AppError('테이블을 찾을 수 없습니다', 404, 'NOT_FOUND');
    }

    return orderHistoryRepository.getHistory(tableId, dateFilter);
  }
}

module.exports = new TableService();
