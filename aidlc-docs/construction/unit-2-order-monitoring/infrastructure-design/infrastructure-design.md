# Infrastructure Design - Unit 2: 주문+모니터링

## 파일 매핑

### Backend (신규 7개 + 수정 1개)
| 파일 | 신규/수정 |
|------|----------|
| server/src/repositories/orderRepository.js | 신규 |
| server/src/services/orderService.js | 신규 |
| server/src/services/sseService.js | 신규 |
| server/src/controllers/orderController.js | 신규 |
| server/src/controllers/sseController.js | 신규 |
| server/src/routes/orderRoutes.js | 신규 |
| server/src/routes/sseRoutes.js | 신규 |
| server/src/app.js | 수정 (orderRoutes, sseRoutes 등록) |

### Frontend (신규 7개 + 수정 1개)
| 파일 | 신규/수정 |
|------|----------|
| client/src/api/orderApi.js | 신규 |
| client/src/api/sseClient.js | 신규 |
| client/src/contexts/CartContext.jsx | 신규 |
| client/src/pages/customer/CartPage.jsx | 신규 |
| client/src/pages/customer/OrderSuccessPage.jsx | 신규 |
| client/src/pages/customer/OrderHistoryPage.jsx | 신규 |
| client/src/pages/admin/DashboardPage.jsx | 신규 |
| client/src/App.jsx | 수정 (라우트 활성화, CartContext 래핑) |

## 합계: 14개 신규 + 2개 수정
