const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config');

let db;

function getDatabase() {
  if (db) return db;

  const dbDir = path.dirname(config.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(config.dbPath);

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const schema = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf-8');
  db.exec(schema);

  return db;
}

function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDatabase, closeDatabase };
