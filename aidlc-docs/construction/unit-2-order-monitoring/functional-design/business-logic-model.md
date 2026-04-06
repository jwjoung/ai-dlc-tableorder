# Unit 2: 주문+모니터링 - Business Logic Model

---

## 1. 주문 생성 플로우 (orderService.createOrder)

```
Input: storeId, tableId, sessionId, items[{ menuId, quantity }]

1. items 검증
   - 비어있으면 → 400 "주문 항목이 없습니다"
2. 각 항목 메뉴 유효성 확인
   - getMenuById(menuId) → 없으면 404
   - is_available=0이면 → 400 "판매 중지된 메뉴입니다"
3. 주문번호 생성
   - generateOrderNumber() → ORD-YYYYMMDD-XXXX
4. 총액 계산
   - SUM(menu.price * quantity)
5. 트랜잭션:
   - orders 테이블에 주문 생성 (status='pending')
   - order_items에 각 항목 저장 (menu_name, unit_price 스냅샷)
6. SSE 브로드캐스트
   - sseService.broadcast(storeId, 'new_order', orderData)
7. 반환: { order, items, totalAmount }
```

---

## 2. 세션별 주문 조회 (orderService.getOrdersBySession)

```
Input: tableId, sessionId

1. getOrdersBySession(tableId, sessionId)
2. 각 주문에 order_items 포함
3. 반환: Order[] (시간 역순)
```

---

## 3. 관리자 전체 주문 조회 (orderService.getAllActiveOrders)

```
Input: storeId

1. getAllOrdersByStore(storeId)
   - 활성 세션의 주문만 (테이블별 그룹화)
2. 테이블 정보 JOIN (table_number)
3. 테이블별 총액 포함
4. 반환: { tableId, tableNumber, orders[], totalAmount }[]
```

---

## 4. 주문 상태 변경 (orderService.updateOrderStatus)

```
Input: orderId, newStatus

1. 주문 존재 확인
   - getOrderById(orderId) → 없으면 404
2. 상태 전이 검증
   - pending → preparing ✅
   - preparing → completed ✅
   - 그 외 → 400 "유효하지 않은 상태 변경입니다"
3. updateOrderStatus(orderId, newStatus)
4. SSE 브로드캐스트
   - sseService.broadcast(storeId, 'order_updated', { orderId, status })
5. 반환: 업데이트된 주문
```

---

## 5. 주문 삭제 (orderService.deleteOrder)

```
Input: orderId

1. 주문 존재 확인 → 없으면 404
2. 주문 정보 저장 (storeId, tableId, sessionId)
3. deleteOrder(orderId) → CASCADE로 order_items 삭제
4. SSE 브로드캐스트
   - sseService.broadcast(storeId, 'order_deleted', { orderId, tableId })
5. 반환: void (204)
```

---

## 6. SSE 실시간 스트림 (sseService)

```
GET /api/sse/orders (관리자 전용)

연결:
1. authMiddleware로 관리자 인증 확인
2. SSE 헤더 설정 (Content-Type: text/event-stream)
3. 클라이언트 등록 (storeId별 Map)
4. Heartbeat 시작 (30초 간격)

해제:
1. req.on('close') 감지
2. heartbeat 정리
3. 클라이언트 목록에서 제거

이벤트 타입:
- new_order: 주문 생성 시
- order_updated: 주문 상태 변경 시
- order_deleted: 주문 삭제 시
- table_completed: 테이블 이용 완료 시 (Unit 3에서 호출)
```

---

## 7. 장바구니 (CartContext - 프론트엔드 전용)

```
클라이언트 측 상태 관리 (localStorage):

addItem(menu):
  - 이미 있으면 quantity +1
  - 없으면 새 항목 추가
  - localStorage 동기화

updateQuantity(menuId, quantity):
  - quantity <= 0이면 항목 제거
  - localStorage 동기화

removeItem(menuId):
  - 항목 제거
  - localStorage 동기화

clearCart():
  - 전체 비우기
  - localStorage 제거

totalAmount:
  - SUM(item.price * item.quantity)

totalItems:
  - SUM(item.quantity)
```

---

## 8. 주문번호 생성 규칙

```
형식: ORD-YYYYMMDD-XXXX
예시: ORD-20260406-0001

XXXX: 해당 날짜의 순번 (매장별)
  - 당일 마지막 주문번호 조회
  - 없으면 0001부터
  - 있으면 +1 (4자리 제로패딩)
```
