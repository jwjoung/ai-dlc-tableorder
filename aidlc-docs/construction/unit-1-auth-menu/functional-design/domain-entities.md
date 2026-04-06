# Unit 1: 인증+메뉴 - Domain Entities

## 개요
Unit 1이 직접 접근하는 DB 테이블과 데이터 접근 패턴을 정의합니다.
스키마 정의는 Unit 0에서 생성 완료 (schema.sql 참조).

---

## 1. admins 테이블

### 데이터 구조
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 관리자 ID |
| store_id | INTEGER FK | 매장 ID |
| username | TEXT | 사용자명 (store_id 내 유니크) |
| password_hash | TEXT | bcrypt 해시 비밀번호 |
| created_at | DATETIME | 생성일시 |

### 접근 패턴 (adminRepository)
| 메서드 | SQL 패턴 | 설명 |
|--------|----------|------|
| findByStoreAndUsername(storeId, username) | `SELECT * FROM admins WHERE store_id = ? AND username = ?` | 로그인 시 관리자 조회 |

---

## 2. tables 테이블

### 데이터 구조
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 테이블 ID |
| store_id | INTEGER FK | 매장 ID |
| table_number | INTEGER | 테이블 번호 (store_id 내 유니크) |
| password_hash | TEXT | bcrypt 해시 비밀번호 |
| created_at | DATETIME | 생성일시 |

### 접근 패턴 (adminRepository에서 테이블 로그인용으로 사용)
| 메서드 | SQL 패턴 | 설명 |
|--------|----------|------|
| findTableByStoreAndNumber(storeId, tableNumber) | `SELECT * FROM tables WHERE store_id = ? AND table_number = ?` | 테이블 로그인 시 조회 |

---

## 3. table_sessions 테이블

### 데이터 구조
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 세션 ID |
| table_id | INTEGER FK | 테이블 ID |
| started_at | DATETIME | 세션 시작 시각 |
| ended_at | DATETIME | 세션 종료 시각 (null = 활성) |
| is_active | INTEGER | 활성 여부 (1/0) |

### 접근 패턴 (adminRepository에서 세션 조회/생성용으로 사용)
| 메서드 | SQL 패턴 | 설명 |
|--------|----------|------|
| findActiveSession(tableId) | `SELECT * FROM table_sessions WHERE table_id = ? AND is_active = 1` | 활성 세션 조회 |
| createSession(tableId) | `INSERT INTO table_sessions (table_id) VALUES (?)` | 새 세션 생성 |

---

## 4. stores 테이블

### 접근 패턴 (adminRepository에서 매장 조회용)
| 메서드 | SQL 패턴 | 설명 |
|--------|----------|------|
| findStoreByIdentifier(storeIdentifier) | `SELECT * FROM stores WHERE store_identifier = ?` | 매장 식별자로 매장 조회 |

---

## 5. categories 테이블

### 데이터 구조
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 카테고리 ID |
| store_id | INTEGER FK | 매장 ID |
| name | TEXT | 카테고리명 |
| display_order | INTEGER | 표시 순서 |
| created_at | DATETIME | 생성일시 |

### 접근 패턴 (menuRepository)
| 메서드 | SQL 패턴 | 설명 |
|--------|----------|------|
| getAllCategories(storeId) | `SELECT * FROM categories WHERE store_id = ? ORDER BY display_order` | 카테고리 목록 조회 |
| getCategoryById(id) | `SELECT * FROM categories WHERE id = ?` | 카테고리 단건 조회 |
| createCategory(storeId, name, displayOrder) | `INSERT INTO categories (store_id, name, display_order) VALUES (?, ?, ?)` | 카테고리 등록 |
| updateCategory(id, name, displayOrder) | `UPDATE categories SET name = ?, display_order = ? WHERE id = ?` | 카테고리 수정 |
| deleteCategory(id) | `DELETE FROM categories WHERE id = ?` | 카테고리 삭제 |
| getMenuCountByCategory(categoryId) | `SELECT COUNT(*) FROM menu_items WHERE category_id = ?` | 카테고리 내 메뉴 수 |

---

## 6. menu_items 테이블

### 데이터 구조
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 메뉴 ID |
| store_id | INTEGER FK | 매장 ID |
| category_id | INTEGER FK | 카테고리 ID |
| name | TEXT | 메뉴명 |
| price | INTEGER | 가격 (원, 0 이상) |
| description | TEXT | 설명 |
| image_url | TEXT | 이미지 URL |
| display_order | INTEGER | 표시 순서 |
| is_available | INTEGER | 판매 가능 여부 (1/0) |
| created_at | DATETIME | 생성일시 |
| updated_at | DATETIME | 수정일시 |

### 접근 패턴 (menuRepository)
| 메서드 | SQL 패턴 | 설명 |
|--------|----------|------|
| getAllMenus(storeId) | `SELECT m.*, c.name AS category_name FROM menu_items m JOIN categories c ON m.category_id = c.id WHERE m.store_id = ? ORDER BY c.display_order, m.display_order` | 전체 메뉴 조회 (카테고리별 정렬) |
| getAvailableMenus(storeId) | 위와 동일 + `AND m.is_available = 1` | 가용 메뉴만 조회 (고객용) |
| getMenuById(id) | `SELECT m.*, c.name AS category_name FROM menu_items m JOIN categories c ON m.category_id = c.id WHERE m.id = ?` | 메뉴 단건 조회 |
| getMenusByCategory(categoryId) | `SELECT * FROM menu_items WHERE category_id = ? ORDER BY display_order` | 카테고리별 메뉴 조회 |
| createMenu(data) | `INSERT INTO menu_items (store_id, category_id, name, price, description, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)` | 메뉴 등록 |
| updateMenu(id, data) | `UPDATE menu_items SET category_id=?, name=?, price=?, description=?, image_url=?, display_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?` | 메뉴 수정 |
| softDeleteMenu(id) | `UPDATE menu_items SET is_available = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?` | 메뉴 소프트 삭제 |
| updateMenuOrder(id, displayOrder) | `UPDATE menu_items SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?` | 순서 변경 |
| findByNameInCategory(categoryId, name) | `SELECT * FROM menu_items WHERE category_id = ? AND name = ? AND is_available = 1` | 카테고리 내 이름 중복 검사 |
| getMaxDisplayOrder(categoryId) | `SELECT MAX(display_order) FROM menu_items WHERE category_id = ?` | 카테고리 내 최대 순서 조회 |
| swapMenuOrder(id1, order1, id2, order2) | 2개 UPDATE를 트랜잭션으로 | 두 메뉴의 순서 교환 |
