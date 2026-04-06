CREATE TABLE IF NOT EXISTS stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  store_identifier TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(store_id, username),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE IF NOT EXISTS tables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  table_number INTEGER NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(store_id, table_number),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE IF NOT EXISTS table_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_id INTEGER NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (table_id) REFERENCES tables(id)
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL CHECK(price >= 0),
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_available INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  table_id INTEGER NOT NULL,
  session_id INTEGER NOT NULL,
  order_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id),
  FOREIGN KEY (table_id) REFERENCES tables(id),
  FOREIGN KEY (session_id) REFERENCES table_sessions(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  menu_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  unit_price INTEGER NOT NULL CHECK(unit_price >= 0),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE TABLE IF NOT EXISTS order_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  table_id INTEGER NOT NULL,
  table_number INTEGER NOT NULL,
  session_id INTEGER NOT NULL,
  order_number TEXT NOT NULL,
  status TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  ordered_at DATETIME NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_history_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_history_id INTEGER NOT NULL,
  menu_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  FOREIGN KEY (order_history_id) REFERENCES order_history(id) ON DELETE CASCADE
);
