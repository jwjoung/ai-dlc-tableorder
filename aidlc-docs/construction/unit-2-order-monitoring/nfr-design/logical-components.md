# Logical Components - Unit 2: 주문+모니터링

## Unit 2 추가 논리 컴포넌트

| # | 컴포넌트 | 파일 | 역할 |
|---|---------|------|------|
| 1 | orderService | server/src/services/orderService.js | 주문 CRUD, 총액 계산, SSE 연동 |
| 2 | sseService | server/src/services/sseService.js | SSE 클라이언트 관리, 브로드캐스트 |
| 3 | orderRepository | server/src/repositories/orderRepository.js | 주문/항목 데이터 접근 |
| 4 | orderController | server/src/controllers/orderController.js | 주문 HTTP 처리 |
| 5 | sseController | server/src/controllers/sseController.js | SSE 연결 처리 |
| 6 | orderRoutes | server/src/routes/orderRoutes.js | /api/orders/* |
| 7 | sseRoutes | server/src/routes/sseRoutes.js | /api/sse/* |
| 8 | CartContext | client/src/contexts/CartContext.jsx | 장바구니 상태 관리 |
| 9 | CartPage | client/src/pages/customer/CartPage.jsx | 장바구니 UI |
| 10 | OrderSuccessPage | client/src/pages/customer/OrderSuccessPage.jsx | 주문 성공 |
| 11 | OrderHistoryPage | client/src/pages/customer/OrderHistoryPage.jsx | 주문 내역 |
| 12 | DashboardPage | client/src/pages/admin/DashboardPage.jsx | 실시간 대시보드 |
| 13 | orderApi | client/src/api/orderApi.js | 주문 API 호출 |
| 14 | sseClient | client/src/api/sseClient.js | SSE 연결 관리 |

## 의존성
```
orderRoutes → orderController → orderService → orderRepository → DB
                                    |
                                    +→ sseService → SSE Clients

sseRoutes → sseController → sseService

CartPage → CartContext → localStorage
CartPage → orderApi → apiClient → /api/orders
DashboardPage → orderApi + sseClient → /api/orders, /api/sse/orders
```
