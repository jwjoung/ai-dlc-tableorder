# Unit 2: 주문+모니터링 - Business Rules

---

## 1. 주문 규칙

### BR-ORD-01: 주문 생성 조건
- 최소 1개 이상의 주문 항목 필요
- 각 항목의 메뉴가 존재하고 is_available=1이어야 함
- quantity는 1 이상 정수
- storeId, tableId, sessionId 필수

### BR-ORD-02: 주문번호
- 형식: ORD-YYYYMMDD-XXXX
- 매장별 + 일자별 순번
- 4자리 제로패딩 (0001~9999)

### BR-ORD-03: 주문 총액
- SUM(unit_price * quantity) 각 항목
- 단가는 주문 시점 메뉴 가격 스냅샷 (메뉴 가격 변경에 영향 안 받음)
- menu_name도 스냅샷 저장

### BR-ORD-04: 주문 상태 전이
| 현재 상태 | 가능한 다음 상태 |
|-----------|----------------|
| pending | preparing |
| preparing | completed |
| completed | (변경 불가) |

- 역방향 전이 불가
- 건너뛰기 불가 (pending → completed 불가)

### BR-ORD-05: 주문 삭제
- 관리자만 가능 (authMiddleware)
- CASCADE로 order_items도 삭제
- 삭제 후 SSE 이벤트 발생

### BR-ORD-06: 주문 조회 범위
- 고객: 현재 세션(tableId + sessionId) 주문만
- 관리자: 매장 전체 주문 (활성 세션)

---

## 2. 장바구니 규칙

### BR-CART-01: 저장 위치
- localStorage (키: 'cart')
- JSON 배열 형태

### BR-CART-02: 항목 구조
```json
{
  "id": "메뉴ID",
  "name": "메뉴명",
  "price": 9000,
  "quantity": 2,
  "image_url": ""
}
```

### BR-CART-03: 수량 제한
- 최소: 1 (0이면 항목 제거)
- 최대: 99

### BR-CART-04: 장바구니 초기화
- 주문 성공 시 자동 비우기
- 수동 비우기 버튼 제공

---

## 3. SSE 규칙

### BR-SSE-01: 연결 관리
- 매장별 클라이언트 그룹 (Map<storeId, Set<Response>>)
- 관리자 인증 필수
- 연결 해제 시 자동 정리

### BR-SSE-02: Heartbeat
- 30초 간격으로 `: ping\n\n` 전송
- 연결 유지 목적

### BR-SSE-03: 이벤트 형식
```
event: {eventType}
data: {JSON}
```

### BR-SSE-04: 이벤트 타입
| 이벤트 | 발생 시점 | 데이터 |
|--------|----------|--------|
| new_order | 주문 생성 | orderId, tableNumber, items, totalAmount |
| order_updated | 상태 변경 | orderId, status |
| order_deleted | 주문 삭제 | orderId, tableId |
| table_completed | 이용 완료 | tableId (Unit 3에서 발생) |

---

## 4. API 응답 규칙

### BR-API-U2-01: 인증 요구사항
| 엔드포인트 | 인증 |
|-----------|------|
| POST /api/orders | tableAuthMiddleware |
| GET /api/orders?tableId&sessionId | tableAuthMiddleware |
| GET /api/orders/admin | authMiddleware |
| PUT /api/orders/:id/status | authMiddleware |
| DELETE /api/orders/:id | authMiddleware |
| GET /api/sse/orders | authMiddleware |

### BR-API-U2-02: 에러 코드
| 상황 | 코드 | code |
|------|------|------|
| 주문 항목 없음 | 400 | VALIDATION_ERROR |
| 판매 중지 메뉴 | 400 | VALIDATION_ERROR |
| 유효하지 않은 상태 전이 | 400 | VALIDATION_ERROR |
| 주문 없음 | 404 | NOT_FOUND |
| 메뉴 없음 | 404 | NOT_FOUND |
