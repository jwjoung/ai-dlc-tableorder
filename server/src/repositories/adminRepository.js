const { getDatabase } = require('../db/database');

class AdminRepository {
  constructor() {
    this.db = getDatabase();
  }

  findStoreByIdentifier(storeIdentifier) {
    return this.db.prepare(
      'SELECT * FROM stores WHERE store_identifier = ?'
    ).get(storeIdentifier);
  }

  findByStoreAndUsername(storeId, username) {
    return this.db.prepare(
      'SELECT * FROM admins WHERE store_id = ? AND username = ?'
    ).get(storeId, username);
  }

  findTableByStoreAndNumber(storeId, tableNumber) {
    return this.db.prepare(
      'SELECT * FROM tables WHERE store_id = ? AND table_number = ?'
    ).get(storeId, tableNumber);
  }

  findActiveSession(tableId) {
    return this.db.prepare(
      'SELECT * FROM table_sessions WHERE table_id = ? AND is_active = 1'
    ).get(tableId);
  }

  createSession(tableId) {
    const result = this.db.prepare(
      'INSERT INTO table_sessions (table_id) VALUES (?)'
    ).run(tableId);
    return this.db.prepare(
      'SELECT * FROM table_sessions WHERE id = ?'
    ).get(result.lastInsertRowid);
  }
}

module.exports = new AdminRepository();
