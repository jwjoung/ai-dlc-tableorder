# Domain Entities - Unit 0: Foundation

---

## Entity Relationship Diagram (Text)

```
stores 1──* admins
stores 1──* tables
stores 1──* categories
stores 1──* menu_items

tables 1──* table_sessions
table_sessions 1──* orders

categories 1──* menu_items

orders 1──* order_items
order_items *──1 menu_items

order_history 1──* order_history_items
```

---

## Entity Definitions

### stores
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 매장 ID |
| name | TEXT | NOT NULL | 매장명 |
| store_identifier | TEXT | NOT NULL UNIQUE | 매장 식별자 (로그인용) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성일시 |

### admins
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 관리자 ID |
| store_id | INTEGER | NOT NULL, FK → stores(id) | 매장 ID |
| username | TEXT | NOT NULL | 사용자명 |
| password_hash | TEXT | NOT NULL | bcrypt 해시 비밀번호 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성일시 |
| | | UNIQUE(store_id, username) | 매장 내 사용자명 유일 |

### tables
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 테이블 ID |
| store_id | INTEGER | NOT NULL, FK → stores(id) | 매장 ID |
| table_number | INTEGER | NOT NULL | 테이블 번호 |
| password_hash | TEXT | NOT NULL | bcrypt 해시 비밀번호 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성일시 |
| | | UNIQUE(store_id, table_number) | 매장 내 테이블번호 유일 |

### table_sessions
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 세션 ID |
| table_id | INTEGER | NOT NULL, FK → tables(id) | 테이블 ID |
| started_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 세션 시작 시각 |
| ended_at | DATETIME | NULL | 세션 종료 시각 (NULL=활성) |
| is_active | INTEGER | DEFAULT 1 | 활성 여부 (1=활성, 0=종료) |

**제약**: 테이블당 활성 세션은 최대 1개

### categories
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 카테고리 ID |
| store_id | INTEGER | NOT NULL, FK → stores(id) | 매장 ID |
| name | TEXT | NOT NULL | 카테고리명 |
| display_order | INTEGER | DEFAULT 0 | 노출 순서 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성일시 |

### menu_items
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 메뉴 ID |
| store_id | INTEGER | NOT NULL, FK → stores(id) | 매장 ID |
| category_id | INTEGER | NOT NULL, FK → categories(id) | 카테고리 ID |
| name | TEXT | NOT NULL | 메뉴명 |
| price | INTEGER | NOT NULL, CHECK(price >= 0) | 가격 (원) |
| description | TEXT | DEFAULT '' | 설명 |
| image_url | TEXT | DEFAULT '' | 이미지 URL |
| display_order | INTEGER | DEFAULT 0 | 노출 순서 |
| is_available | INTEGER | DEFAULT 1 | 판매 가능 (1=가능, 0=불가) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성일시 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 수정일시 |

### orders
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 주문 ID |
| store_id | INTEGER | NOT NULL, FK → stores(id) | 매장 ID |
| table_id | INTEGER | NOT NULL, FK → tables(id) | 테이블 ID |
| session_id | INTEGER | NOT NULL, FK → table_sessions(id) | 세션 ID |
| order_number | TEXT | NOT NULL | 주문 번호 (표시용) |
| status | TEXT | NOT NULL DEFAULT 'pending' | 상태 |
| total_amount | INTEGER | NOT NULL DEFAULT 0 | 총 금액 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 주문 시각 |

**status 허용값**: 'pending', 'preparing', 'completed'
**order_number 생성 규칙**: `ORD-{YYYYMMDD}-{4자리 순번}` (예: ORD-20260406-0001)

### order_items
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 항목 ID |
| order_id | INTEGER | NOT NULL, FK → orders(id) ON DELETE CASCADE | 주문 ID |
| menu_item_id | INTEGER | NOT NULL, FK → menu_items(id) | 메뉴 ID |
| menu_name | TEXT | NOT NULL | 주문 시점 메뉴명 (스냅샷) |
| quantity | INTEGER | NOT NULL, CHECK(quantity > 0) | 수량 |
| unit_price | INTEGER | NOT NULL, CHECK(unit_price >= 0) | 주문 시점 단가 (스냅샷) |

### order_history
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 이력 ID |
| store_id | INTEGER | NOT NULL | 매장 ID |
| table_id | INTEGER | NOT NULL | 테이블 ID |
| table_number | INTEGER | NOT NULL | 테이블 번호 (스냅샷) |
| session_id | INTEGER | NOT NULL | 원본 세션 ID |
| order_number | TEXT | NOT NULL | 주문 번호 |
| status | TEXT | NOT NULL | 최종 상태 |
| total_amount | INTEGER | NOT NULL | 총 금액 |
| ordered_at | DATETIME | NOT NULL | 원본 주문 시각 |
| completed_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 이용 완료 시각 |

### order_history_items
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 항목 ID |
| order_history_id | INTEGER | NOT NULL, FK → order_history(id) ON DELETE CASCADE | 이력 ID |
| menu_name | TEXT | NOT NULL | 메뉴명 |
| quantity | INTEGER | NOT NULL | 수량 |
| unit_price | INTEGER | NOT NULL | 단가 |

---

## Seed Data

### 초기 매장
- store_identifier: "store1", name: "테스트 매장"

### 초기 관리자
- username: "admin", password: "admin1234" (bcrypt 해시)

### 초기 테이블
- 테이블 1~5번, password: "1234" (bcrypt 해시)

### 초기 카테고리 및 메뉴
- 카테고리: 메인메뉴, 사이드메뉴, 음료
- 메뉴: 카테고리별 3~4개 샘플 메뉴 (이미지는 placeholder URL)
