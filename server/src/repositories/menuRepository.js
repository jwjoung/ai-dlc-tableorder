const { getDatabase } = require('../db/database');

class MenuRepository {
  constructor() {
    this.db = getDatabase();
  }

  // --- Categories ---

  getAllCategories(storeId) {
    return this.db.prepare(
      'SELECT * FROM categories WHERE store_id = ? ORDER BY display_order'
    ).all(storeId);
  }

  getCategoryById(id) {
    return this.db.prepare(
      'SELECT * FROM categories WHERE id = ?'
    ).get(id);
  }

  createCategory(storeId, name, displayOrder) {
    const result = this.db.prepare(
      'INSERT INTO categories (store_id, name, display_order) VALUES (?, ?, ?)'
    ).run(storeId, name, displayOrder);
    return this.getCategoryById(result.lastInsertRowid);
  }

  updateCategory(id, name, displayOrder) {
    this.db.prepare(
      'UPDATE categories SET name = ?, display_order = ? WHERE id = ?'
    ).run(name, displayOrder, id);
    return this.getCategoryById(id);
  }

  deleteCategory(id) {
    this.db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  }

  getMenuCountByCategory(categoryId) {
    const row = this.db.prepare(
      'SELECT COUNT(*) as count FROM menu_items WHERE category_id = ?'
    ).get(categoryId);
    return row.count;
  }

  getMaxCategoryOrder(storeId) {
    const row = this.db.prepare(
      'SELECT MAX(display_order) as max_order FROM categories WHERE store_id = ?'
    ).get(storeId);
    return row.max_order || 0;
  }

  // --- Menu Items ---

  getAllMenus(storeId) {
    return this.db.prepare(
      `SELECT m.*, c.name AS category_name
       FROM menu_items m
       JOIN categories c ON m.category_id = c.id
       WHERE m.store_id = ?
       ORDER BY c.display_order, m.display_order`
    ).all(storeId);
  }

  getAvailableMenus(storeId) {
    return this.db.prepare(
      `SELECT m.*, c.name AS category_name
       FROM menu_items m
       JOIN categories c ON m.category_id = c.id
       WHERE m.store_id = ? AND m.is_available = 1
       ORDER BY c.display_order, m.display_order`
    ).all(storeId);
  }

  getMenuById(id) {
    return this.db.prepare(
      `SELECT m.*, c.name AS category_name
       FROM menu_items m
       JOIN categories c ON m.category_id = c.id
       WHERE m.id = ?`
    ).get(id);
  }

  getMenusByCategory(categoryId) {
    return this.db.prepare(
      'SELECT * FROM menu_items WHERE category_id = ? AND is_available = 1 ORDER BY display_order'
    ).all(categoryId);
  }

  createMenu(data) {
    const result = this.db.prepare(
      `INSERT INTO menu_items (store_id, category_id, name, price, description, image_url, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      data.store_id, data.category_id, data.name, data.price,
      data.description || '', data.image_url || '', data.display_order
    );
    return this.getMenuById(result.lastInsertRowid);
  }

  updateMenu(id, data) {
    this.db.prepare(
      `UPDATE menu_items
       SET category_id = ?, name = ?, price = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(data.category_id, data.name, data.price, data.description || '', data.image_url || '', id);
    return this.getMenuById(id);
  }

  softDeleteMenu(id) {
    this.db.prepare(
      'UPDATE menu_items SET is_available = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(id);
  }

  updateMenuDisplayOrder(id, displayOrder) {
    this.db.prepare(
      'UPDATE menu_items SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(displayOrder, id);
  }

  findByNameInCategory(categoryId, name, excludeId = null) {
    if (excludeId) {
      return this.db.prepare(
        'SELECT * FROM menu_items WHERE category_id = ? AND name = ? AND is_available = 1 AND id != ?'
      ).get(categoryId, name, excludeId);
    }
    return this.db.prepare(
      'SELECT * FROM menu_items WHERE category_id = ? AND name = ? AND is_available = 1'
    ).get(categoryId, name);
  }

  getMaxDisplayOrder(categoryId) {
    const row = this.db.prepare(
      'SELECT MAX(display_order) as max_order FROM menu_items WHERE category_id = ?'
    ).get(categoryId);
    return row.max_order || 0;
  }

  swapMenuOrder(id1, order1, id2, order2) {
    const swap = this.db.transaction(() => {
      this.db.prepare(
        'UPDATE menu_items SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).run(order2, id1);
      this.db.prepare(
        'UPDATE menu_items SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).run(order1, id2);
    });
    swap();
  }
}

module.exports = new MenuRepository();
