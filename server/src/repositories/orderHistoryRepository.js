const { getDatabase } = require('../db/database');

class OrderHistoryRepository {
  constructor() {
    this.db = getDatabase();
  }

  moveOrdersToHistory(orders, tableNumber) {
    const db = this.db;

    const insertHistory = db.prepare(
      `INSERT INTO order_history (store_id, table_id, table_number, session_id, order_number, status, total_amount, ordered_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const insertHistoryItem = db.prepare(
      `INSERT INTO order_history_items (order_history_id, menu_name, quantity, unit_price)
       VALUES (?, ?, ?, ?)`
    );

    const deleteOrder = db.prepare('DELETE FROM orders WHERE id = ?');

    const moveTx = db.transaction(() => {
      for (const order of orders) {
        const histResult = insertHistory.run(
          order.store_id,
          order.table_id,
          tableNumber,
          order.session_id,
          order.order_number,
          order.status,
          order.total_amount,
          order.created_at
        );

        const historyId = histResult.lastInsertRowid;

        if (order.items) {
          for (const item of order.items) {
            insertHistoryItem.run(historyId, item.menu_name, item.quantity, item.unit_price);
          }
        }

        deleteOrder.run(order.id);
      }
    });

    moveTx();
  }

  getHistory(tableId, dateFilter) {
    let sql = 'SELECT * FROM order_history WHERE table_id = ?';
    const params = [tableId];

    if (dateFilter?.from) {
      sql += ' AND completed_at >= ?';
      params.push(dateFilter.from + ' 00:00:00');
    }
    if (dateFilter?.to) {
      sql += ' AND completed_at <= ?';
      params.push(dateFilter.to + ' 23:59:59');
    }

    sql += ' ORDER BY completed_at DESC';

    const histories = this.db.prepare(sql).all(...params);

    const itemStmt = this.db.prepare(
      'SELECT * FROM order_history_items WHERE order_history_id = ?'
    );

    return histories.map(h => ({
      ...h,
      items: itemStmt.all(h.id),
    }));
  }
}

module.exports = new OrderHistoryRepository();
