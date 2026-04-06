# Unit 2: 주문+모니터링 - Frontend Components

---

## 1. CartContext (contexts/CartContext.jsx)

### 상태
| 상태 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| items | array | localStorage 복원 | 장바구니 항목 |
| totalAmount | number | 계산값 | 총액 |
| totalItems | number | 계산값 | 총 수량 |

### 메서드
| 메서드 | 설명 |
|--------|------|
| addItem(menu) | 항목 추가 (이미 있으면 quantity+1) |
| updateQuantity(menuId, quantity) | 수량 변경 (0이면 삭제) |
| removeItem(menuId) | 항목 삭제 |
| clearCart() | 전체 비우기 |

---

## 2. CartPage (pages/customer/CartPage.jsx)

### 역할
장바구니 관리, 주문 확정

### 상태
| 상태 | 타입 | 설명 |
|------|------|------|
| isSubmitting | boolean | 주문 제출 중 |
| error | string|null | 에러 메시지 |

### UI 구성
- 장바구니 항목 리스트 (메뉴명, 단가, 수량 +-버튼, 소계, 삭제)
- 총액 표시
- 장바구니 비우기 버튼
- 주문 확정 버튼
- 장바구니가 비었을 때 안내 메시지
- 하단 네비게이션

### 플로우
```
장바구니 비어있음 → "장바구니가 비어있습니다" + 메뉴로 이동 버튼
장바구니 있음 → 항목 표시
  수량 변경 → CartContext.updateQuantity
  삭제 → CartContext.removeItem
  비우기 → 확인 후 CartContext.clearCart
  주문 확정 →
    → orderApi.createOrder(items)
    → 성공: CartContext.clearCart → /customer/order-success?orderId=X
    → 실패: 에러 메시지 표시
```

---

## 3. OrderSuccessPage (pages/customer/OrderSuccessPage.jsx)

### 역할
주문 성공 화면 (5초 표시 후 메뉴로 리다이렉트)

### 상태
| 상태 | 타입 | 설명 |
|------|------|------|
| countdown | number | 남은 초 (5→0) |
| orderNumber | string | 주문번호 |

### UI 구성
- 주문 성공 아이콘/메시지
- 주문번호 표시
- 카운트다운 표시 "X초 후 메뉴 화면으로 이동합니다"
- 바로 이동 버튼

### 플로우
```
URL에서 orderNumber 파라미터 추출
5초 카운트다운 시작
0초 → navigate('/customer/menu')
또는 "바로 이동" 클릭 → navigate('/customer/menu')
```

---

## 4. OrderHistoryPage (pages/customer/OrderHistoryPage.jsx)

### 역할
현재 세션 주문 내역 조회

### 상태
| 상태 | 타입 | 설명 |
|------|------|------|
| orders | array | 주문 목록 |
| isLoading | boolean | 로딩 중 |
| error | string|null | 에러 메시지 |

### UI 구성
- 주문 카드 리스트 (시간 역순)
  - 주문번호, 주문시각
  - 메뉴 항목 (이름, 수량, 단가)
  - 총액
  - 상태 뱃지 (대기중/준비중/완료)
- 주문이 없을 때 안내 메시지
- 하단 네비게이션

---

## 5. DashboardPage (pages/admin/DashboardPage.jsx)

### 역할
관리자 실시간 주문 모니터링 대시보드

### 상태
| 상태 | 타입 | 설명 |
|------|------|------|
| tables | array | 테이블별 주문 데이터 |
| isLoading | boolean | 초기 로딩 |
| error | string|null | 에러 |
| selectedTable | object|null | 선택된 테이블 (상세 보기) |
| highlightedOrders | Set | 신규 주문 하이라이트 |

### SSE 연결
```
useEffect로 SSE 연결:
  - sseClient.connect()
  - new_order: 테이블 데이터에 주문 추가, 하이라이트 설정
  - order_updated: 해당 주문 상태 업데이트
  - order_deleted: 해당 주문 제거
  - table_completed: 해당 테이블 데이터 초기화
  - cleanup: sseClient.disconnect()
```

### UI 구성
- 헤더: "주문 대시보드", 메뉴관리 링크, 로그아웃
- 테이블 그리드 (반응형 2~4열)
  - 테이블 카드: 테이블번호, 총주문액, 최근 주문 미리보기
  - 신규 주문 하이라이트 (배경 색상 변경, 3초 후 해제)
  - 클릭 → 상세 주문 목록 모달 (Unit 3 TableDetailModal)
- 빈 테이블도 표시 (주문 없음 상태)

### 주문 상태 변경 (인라인)
- 각 주문에 상태 변경 버튼
- pending → "준비 시작" 버튼
- preparing → "완료" 버튼
- completed → (변경 불가)

---

## 6. API Client Modules

### orderApi (api/orderApi.js)
| 메서드 | HTTP | URL |
|--------|------|-----|
| createOrder(items) | POST | /orders |
| getMyOrders() | GET | /orders?tableId=X&sessionId=Y |
| getAllOrders() | GET | /orders/admin |
| updateOrderStatus(id, status) | PUT | /orders/:id/status |
| deleteOrder(id) | DELETE | /orders/:id |

### sseClient (api/sseClient.js)
| 메서드 | 설명 |
|--------|------|
| connect(onEvent) | SSE 연결, 이벤트 핸들러 등록 |
| disconnect() | SSE 연결 해제 |

---

## 7. 라우팅 변경사항 (App.jsx)

| 경로 | 컴포넌트 | 인증 |
|------|---------|------|
| /customer/cart | CartPage | table 인증 |
| /customer/order-success | OrderSuccessPage | table 인증 |
| /customer/orders | OrderHistoryPage | table 인증 |
| /admin/dashboard | DashboardPage | admin 인증 |
