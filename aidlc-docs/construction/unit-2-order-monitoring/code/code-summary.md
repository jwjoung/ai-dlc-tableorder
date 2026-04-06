# Code Summary - Unit 2: 주문+모니터링

## 생성된 파일 (14개 신규 + 2개 수정)

### Backend (7개 신규 + 1개 수정)
| 파일 | 설명 |
|------|------|
| server/src/repositories/orderRepository.js | 주문/항목 CRUD, 주문번호 생성, 트랜잭션 |
| server/src/services/orderService.js | 주문 생성/상태변경/삭제, SSE 연동 |
| server/src/services/sseService.js | SSE 클라이언트 관리, 브로드캐스트, heartbeat |
| server/src/controllers/orderController.js | 주문 HTTP 요청/응답 |
| server/src/controllers/sseController.js | SSE 연결 처리 |
| server/src/routes/orderRoutes.js | /api/orders/* |
| server/src/routes/sseRoutes.js | /api/sse/* (token 쿼리 파라미터 지원) |
| server/src/app.js (수정) | orderRoutes, sseRoutes 등록 |

### Frontend (7개 신규 + 1개 수정)
| 파일 | Story | 설명 |
|------|-------|------|
| client/src/api/orderApi.js | - | 주문 API 호출 |
| client/src/api/sseClient.js | - | SSE 연결 관리 |
| client/src/contexts/CartContext.jsx | US-C03 | 장바구니 상태 (localStorage 동기화) |
| client/src/pages/customer/CartPage.jsx | US-C03,C04 | 장바구니 관리, 주문 확정 |
| client/src/pages/customer/OrderSuccessPage.jsx | US-C04 | 주문 성공 (5초 카운트다운) |
| client/src/pages/customer/OrderHistoryPage.jsx | US-C05 | 세션 주문 내역 |
| client/src/pages/admin/DashboardPage.jsx | US-A02,A03 | 실시간 대시보드, 상태 변경 |
| client/src/App.jsx (수정) | - | CartProvider, 라우트 활성화 |

## Story 구현 현황
| Story | 상태 |
|-------|------|
| US-C03 장바구니에 메뉴 추가 | ✅ |
| US-C04 주문 생성 및 확인 | ✅ |
| US-C05 주문 내역 조회 | ✅ |
| US-A02 실시간 주문 모니터링 | ✅ |
| US-A03 주문 상태 변경 | ✅ |

## API 엔드포인트 구현 현황
| Method | Endpoint | 상태 |
|--------|----------|------|
| POST | /api/orders | ✅ |
| GET | /api/orders | ✅ |
| GET | /api/orders/admin | ✅ |
| PUT | /api/orders/:id/status | ✅ |
| DELETE | /api/orders/:id | ✅ |
| GET | /api/sse/orders | ✅ |
