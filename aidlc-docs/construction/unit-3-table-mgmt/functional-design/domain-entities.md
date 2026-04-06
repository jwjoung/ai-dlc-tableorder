# Unit 3: 테이블관리 - Domain Entities

---

## 1. tables 테이블 (tableRepository)
| 메서드 | 설명 |
|--------|------|
| getAllTables(storeId) | 매장 전체 테이블 목록 |
| getTableById(id) | 테이블 단건 조회 |
| createTable(storeId, tableNumber, passwordHash) | 테이블 등록 |
| updateTable(id, tableNumber, passwordHash) | 테이블 수정 |

## 2. table_sessions 테이블 (sessionRepository)
| 메서드 | 설명 |
|--------|------|
| getActiveSession(tableId) | 활성 세션 조회 |
| createSession(tableId) | 세션 생성 |
| endSession(sessionId) | 세션 종료 (ended_at, is_active=0) |

## 3. orders / order_items (읽기+삭제)
| 메서드 | 설명 |
|--------|------|
| getOrdersBySession(tableId, sessionId) | 세션 주문 조회 |
| deleteOrder(orderId) | 주문 삭제 (Unit 2 API 호출 또는 직접) |

## 4. order_history / order_history_items (orderHistoryRepository)
| 메서드 | 설명 |
|--------|------|
| moveOrdersToHistory(orders, tableNumber) | 주문→이력 이동 (트랜잭션) |
| getHistory(tableId, dateFilter) | 과거 내역 조회 (날짜 필터) |
