const { getDatabase } = require('../db/database');

class SessionRepository {
  constructor() {
    this.db = getDatabase();
  }

  getActiveSession(tableId) {
    return this.db.prepare(
      'SELECT * FROM table_sessions WHERE table_id = ? AND is_active = 1'
    ).get(tableId);
  }

  createSession(tableId) {
    const result = this.db.prepare(
      'INSERT INTO table_sessions (table_id) VALUES (?)'
    ).run(tableId);
    return this.db.prepare('SELECT * FROM table_sessions WHERE id = ?').get(result.lastInsertRowid);
  }

  endSession(sessionId) {
    this.db.prepare(
      'UPDATE table_sessions SET is_active = 0, ended_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(sessionId);
  }
}

module.exports = new SessionRepository();
