# Unit 2: 주문+모니터링 - Domain Entities

## 개요
Unit 2가 직접 접근하는 DB 테이블과 데이터 접근 패턴을 정의합니다.

---

## 1. orders 테이블

### 데이터 구조
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 주문 ID |
| store_id | INTEGER FK | 매장 ID |
| table_id | INTEGER FK | 테이블 ID |
| session_id | INTEGER FK | 세션 ID |
| order_number | TEXT | 주문 번호 (ORD-YYYYMMDD-XXXX) |
| status | TEXT | 상태 (pending/preparing/completed) |
| total_amount | INTEGER | 총액 (원) |
| created_at | DATETIME | 주문 시각 |

### 접근 패턴 (orderRepository)
| 메서드 | SQL 패턴 | 설명 |
|--------|----------|------|
| createOrder(data) | INSERT INTO orders | 주문 생성 |
| createOrderItem(orderId, item) | INSERT INTO order_items | 주문 항목 생성 |
| getOrderById(id) | SELECT + JOIN order_items | 주문 상세 조회 |
| getOrdersBySession(tableId, sessionId) | SELECT WHERE table_id=? AND session_id=? ORDER BY created_at DESC | 세션별 주문 조회 |
| getActiveOrdersByStore(storeId) | SELECT WHERE store_id=? AND status != 'completed' | 관리자용 활성 주문 |
| getAllOrdersByStore(storeId) | SELECT WHERE store_id=? | 관리자용 전체 주문 |
| updateOrderStatus(id, status) | UPDATE orders SET status=? | 상태 변경 |
| deleteOrder(id) | DELETE FROM orders WHERE id=? (CASCADE로 order_items 삭제) | 주문 삭제 |
| getTableTotal(tableId, sessionId) | SELECT SUM(total_amount) | 테이블 총액 계산 |
| generateOrderNumber() | ORD-YYYYMMDD-XXXX 형식 생성 | 주문번호 생성 |

---

## 2. order_items 테이블

### 데이터 구조
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 항목 ID |
| order_id | INTEGER FK | 주문 ID (CASCADE DELETE) |
| menu_item_id | INTEGER FK | 메뉴 ID |
| menu_name | TEXT | 메뉴명 스냅샷 |
| quantity | INTEGER | 수량 (1 이상) |
| unit_price | INTEGER | 단가 스냅샷 (0 이상) |

---

## 3. menu_items 테이블 (읽기 전용)

### 접근 패턴
| 메서드 | 설명 |
|--------|------|
| getMenuById(id) | 주문 생성 시 메뉴 유효성/가격 확인 |
