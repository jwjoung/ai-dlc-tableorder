const { getDatabase } = require('../db/database');

class OrderRepository {
  constructor() {
    this.db = getDatabase();
  }

  generateOrderNumber(storeId) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `ORD-${today}-`;

    const lastOrder = this.db.prepare(
      `SELECT order_number FROM orders
       WHERE store_id = ? AND order_number LIKE ?
       ORDER BY order_number DESC LIMIT 1`
    ).get(storeId, `${prefix}%`);

    let seq = 1;
    if (lastOrder) {
      const lastSeq = parseInt(lastOrder.order_number.slice(-4), 10);
      seq = lastSeq + 1;
    }

    return `${prefix}${String(seq).padStart(4, '0')}`;
  }

  createOrder(data, items) {
    const createTx = this.db.transaction(() => {
      const orderNumber = this.generateOrderNumber(data.store_id);
      let totalAmount = 0;
      for (const item of items) {
        totalAmount += item.unit_price * item.quantity;
      }

      const orderResult = this.db.prepare(
        `INSERT INTO orders (store_id, table_id, session_id, order_number, status, total_amount)
         VALUES (?, ?, ?, ?, 'pending', ?)`
      ).run(data.store_id, data.table_id, data.session_id, orderNumber, totalAmount);

      const orderId = orderResult.lastInsertRowid;

      const itemStmt = this.db.prepare(
        `INSERT INTO order_items (order_id, menu_item_id, menu_name, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?)`
      );

      for (const item of items) {
        itemStmt.run(orderId, item.menu_item_id, item.menu_name, item.quantity, item.unit_price);
      }

      return orderId;
    });

    const orderId = createTx();
    return this.getOrderById(orderId);
  }

  getOrderById(id) {
    const order = this.db.prepare(
      'SELECT * FROM orders WHERE id = ?'
    ).get(id);

    if (!order) return null;

    const items = this.db.prepare(
      'SELECT * FROM order_items WHERE order_id = ?'
    ).all(id);

    return { ...order, items };
  }

  getOrdersBySession(tableId, sessionId) {
    const orders = this.db.prepare(
      'SELECT * FROM orders WHERE table_id = ? AND session_id = ? ORDER BY created_at DESC'
    ).all(tableId, sessionId);

    const itemStmt = this.db.prepare(
      'SELECT * FROM order_items WHERE order_id = ?'
    );

    return orders.map(order => ({
      ...order,
      items: itemStmt.all(order.id),
    }));
  }

  getAllOrdersByStore(storeId) {
    const orders = this.db.prepare(
      `SELECT o.*, t.table_number
       FROM orders o
       JOIN tables t ON o.table_id = t.id
       JOIN table_sessions ts ON o.session_id = ts.id
       WHERE o.store_id = ? AND ts.is_active = 1
       ORDER BY o.created_at DESC`
    ).all(storeId);

    const itemStmt = this.db.prepare(
      'SELECT * FROM order_items WHERE order_id = ?'
    );

    return orders.map(order => ({
      ...order,
      items: itemStmt.all(order.id),
    }));
  }

  updateOrderStatus(id, status) {
    this.db.prepare(
      'UPDATE orders SET status = ? WHERE id = ?'
    ).run(status, id);
    return this.getOrderById(id);
  }

  deleteOrder(id) {
    this.db.prepare('DELETE FROM orders WHERE id = ?').run(id);
  }

  getTableTotal(tableId, sessionId) {
    const row = this.db.prepare(
      'SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE table_id = ? AND session_id = ?'
    ).get(tableId, sessionId);
    return row.total;
  }
}

module.exports = new OrderRepository();
