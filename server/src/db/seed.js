const bcrypt = require('bcryptjs');
const { getDatabase, closeDatabase } = require('./database');

function seed() {
  const db = getDatabase();

  const storeCount = db.prepare('SELECT COUNT(*) as count FROM stores').get().count;
  if (storeCount > 0) {
    console.log('Database already seeded. Skipping.');
    closeDatabase();
    return;
  }

  console.log('Seeding database...');

  const adminPassword = bcrypt.hashSync('admin1234', 10);
  const tablePassword = bcrypt.hashSync('1234', 10);

  const seedTransaction = db.transaction(() => {
    // Store
    const storeResult = db.prepare(
      'INSERT INTO stores (name, store_identifier) VALUES (?, ?)'
    ).run('테스트 매장', 'store1');
    const storeId = storeResult.lastInsertRowid;

    // Admin
    db.prepare(
      'INSERT INTO admins (store_id, username, password_hash) VALUES (?, ?, ?)'
    ).run(storeId, 'admin', adminPassword);

    // Tables (1~5)
    for (let i = 1; i <= 5; i++) {
      db.prepare(
        'INSERT INTO tables (store_id, table_number, password_hash) VALUES (?, ?, ?)'
      ).run(storeId, i, tablePassword);
    }

    // Categories
    const categories = [
      { name: '메인메뉴', order: 1 },
      { name: '사이드메뉴', order: 2 },
      { name: '음료', order: 3 },
    ];
    const categoryIds = {};
    for (const cat of categories) {
      const result = db.prepare(
        'INSERT INTO categories (store_id, name, display_order) VALUES (?, ?, ?)'
      ).run(storeId, cat.name, cat.order);
      categoryIds[cat.name] = result.lastInsertRowid;
    }

    // Menu Items
    const menuItems = [
      { categoryName: '메인메뉴', name: '김치찌개', price: 9000, description: '돼지고기 김치찌개', order: 1 },
      { categoryName: '메인메뉴', name: '된장찌개', price: 8000, description: '두부 된장찌개', order: 2 },
      { categoryName: '메인메뉴', name: '불고기', price: 12000, description: '양념 소불고기', order: 3 },
      { categoryName: '메인메뉴', name: '비빔밥', price: 10000, description: '야채 비빔밥', order: 4 },
      { categoryName: '사이드메뉴', name: '계란말이', price: 5000, description: '치즈 계란말이', order: 1 },
      { categoryName: '사이드메뉴', name: '감자전', price: 6000, description: '바삭 감자전', order: 2 },
      { categoryName: '사이드메뉴', name: '떡볶이', price: 5000, description: '매콤 떡볶이', order: 3 },
      { categoryName: '음료', name: '콜라', price: 2000, description: '코카콜라 350ml', order: 1 },
      { categoryName: '음료', name: '사이다', price: 2000, description: '칠성사이다 350ml', order: 2 },
      { categoryName: '음료', name: '맥주', price: 4000, description: '카스 500ml', order: 3 },
    ];

    for (const item of menuItems) {
      db.prepare(
        `INSERT INTO menu_items (store_id, category_id, name, price, description, image_url, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(storeId, categoryIds[item.categoryName], item.name, item.price, item.description, '', item.order);
    }
  });

  seedTransaction();

  console.log('Database seeded successfully!');
  console.log('  Store: store1 (테스트 매장)');
  console.log('  Admin: admin / admin1234');
  console.log('  Tables: 1~5 (password: 1234)');
  console.log('  Categories: 메인메뉴, 사이드메뉴, 음료');
  console.log('  Menu Items: 10개');

  closeDatabase();
}

seed();
