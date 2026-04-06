const { getDatabase } = require('../db/database');

class TableRepository {
  constructor() {
    this.db = getDatabase();
  }

  getAllTables(storeId) {
    return this.db.prepare(
      `SELECT t.*, ts.id as session_id, ts.is_active, ts.started_at as session_started_at
       FROM tables t
       LEFT JOIN table_sessions ts ON t.id = ts.table_id AND ts.is_active = 1
       WHERE t.store_id = ?
       ORDER BY t.table_number`
    ).all(storeId);
  }

  getTableById(id) {
    return this.db.prepare('SELECT * FROM tables WHERE id = ?').get(id);
  }

  findByStoreAndNumber(storeId, tableNumber, excludeId = null) {
    if (excludeId) {
      return this.db.prepare(
        'SELECT * FROM tables WHERE store_id = ? AND table_number = ? AND id != ?'
      ).get(storeId, tableNumber, excludeId);
    }
    return this.db.prepare(
      'SELECT * FROM tables WHERE store_id = ? AND table_number = ?'
    ).get(storeId, tableNumber);
  }

  createTable(storeId, tableNumber, passwordHash) {
    const result = this.db.prepare(
      'INSERT INTO tables (store_id, table_number, password_hash) VALUES (?, ?, ?)'
    ).run(storeId, tableNumber, passwordHash);
    return this.getTableById(result.lastInsertRowid);
  }

  updateTable(id, data) {
    if (data.password_hash) {
      this.db.prepare(
        'UPDATE tables SET table_number = ?, password_hash = ? WHERE id = ?'
      ).run(data.table_number, data.password_hash, id);
    } else {
      this.db.prepare(
        'UPDATE tables SET table_number = ? WHERE id = ?'
      ).run(data.table_number, id);
    }
    return this.getTableById(id);
  }
}

module.exports = new TableRepository();
