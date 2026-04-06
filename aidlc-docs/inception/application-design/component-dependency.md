# 컴포넌트 의존성 - 테이블오더 서비스

---

## 1. 시스템 전체 아키텍처

```
+--------------------------------------------------+
|              Frontend (React + Vite)              |
|                                                   |
|  +-------------------+  +---------------------+  |
|  | Customer Pages    |  | Admin Pages         |  |
|  | - SetupPage       |  | - LoginPage         |  |
|  | - MenuPage        |  | - DashboardPage     |  |
|  | - CartPage        |  | - MenuManagementPage|  |
|  | - OrderSuccessPage|  | - TableSettingsPage  |  |
|  | - OrderHistoryPage|  |                     |  |
|  +--------+----------+  +----------+----------+  |
|           |                        |              |
|  +--------v------------------------v----------+  |
|  |        API Client + SSE Client             |  |
|  +--------------------+-----------------------+  |
+------------------------|-------------------------+
                         | HTTP / SSE
+------------------------|-------------------------+
|              Backend (Express)                    |
|                                                   |
|  +--------------------+-----------------------+  |
|  |              Routes + Middleware            |  |
|  +--------------------+-----------------------+  |
|           |                                       |
|  +--------v---------------------------------------+
|  |              Controllers                       |
|  +--------+---------------------------------------+
|           |                                       |
|  +--------v---------------------------------------+
|  |              Services                          |
|  |  auth | menu | order | table | sse             |
|  +--------+---------------------------------------+
|           |                                       |
|  +--------v---------------------------------------+
|  |              Repositories                      |
|  +--------+---------------------------------------+
|           |                                       |
|  +--------v----------+                            |
|  |    SQLite DB      |                            |
|  +-------------------+                            |
+--------------------------------------------------+
```

---

## 2. 백엔드 서비스 의존성 매트릭스

| 서비스 | adminRepo | tableRepo | sessionRepo | menuRepo | orderRepo | historyRepo | sseService |
|--------|-----------|-----------|-------------|----------|-----------|-------------|------------|
| authService | O | O | O | - | - | - | - |
| menuService | - | - | - | O | - | - | - |
| orderService | - | - | O | O | O | - | O |
| tableService | - | O | O | - | O | O | O |
| sseService | - | - | - | - | - | - | - |

---

## 3. 데이터 흐름

### 3.1 고객 주문 플로우
```
Customer UI --> POST /api/orders
                    |
            orderController.createOrder()
                    |
            orderService.createOrder()
                    |
            +-------+-------+
            |               |
    orderRepo.create()  sseService.broadcast('new_order')
                                |
                        Admin Dashboard (SSE)
```

### 3.2 관리자 이용 완료 플로우
```
Admin UI --> POST /api/tables/:id/complete
                    |
            tableController.completeTable()
                    |
            tableService.completeTable()
                    |
    +---------------+---------------+
    |               |               |
orderRepo       historyRepo     sseService
.findBySession()  .create()     .broadcast('table_completed')
    |
orderRepo
.deleteBySession()
```

### 3.3 실시간 모니터링 플로우
```
Admin UI --> GET /api/sse/orders (SSE connection)
                    |
            sseController.subscribe()
                    |
            sseService.addClient(res)
                    |
            [Connection maintained]
                    |
            On new_order/order_updated/order_deleted/table_completed:
            sseService.broadcastOrder() --> res.write(event data)
```

---

## 4. 프론트엔드 의존성

### 4.1 Context 의존성
| 컴포넌트 | AuthContext | CartContext |
|----------|------------|------------|
| Customer Pages | O (테이블 인증) | O (장바구니) |
| Admin Pages | O (관리자 인증) | - |

### 4.2 API 클라이언트 의존성
| 페이지 | authApi | menuApi | orderApi | tableApi | sseClient |
|--------|---------|---------|----------|----------|-----------|
| SetupPage | O | - | - | - | - |
| MenuPage | - | O | - | - | - |
| CartPage | - | - | O | - | - |
| OrderHistoryPage | - | - | O | - | - |
| LoginPage | O | - | - | - | - |
| DashboardPage | - | - | O | O | O |
| MenuManagementPage | - | O | - | - | - |
| TableSettingsPage | - | - | - | O | - |
