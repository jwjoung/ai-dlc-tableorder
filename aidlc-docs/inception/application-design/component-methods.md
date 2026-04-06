# 컴포넌트 메서드 정의 - 테이블오더 서비스

> 상세 비즈니스 규칙은 Functional Design 단계에서 정의됩니다.

---

## 1. 백엔드 API 엔드포인트

### 1.1 인증 (authRoutes)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | /api/auth/admin/login | 관리자 로그인 | No |
| POST | /api/auth/table/login | 테이블 자동 로그인 | No |
| POST | /api/auth/verify | 토큰 유효성 검증 | Yes |

### 1.2 메뉴 (menuRoutes)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /api/menus | 메뉴 전체 조회 (카테고리 포함) | Table |
| GET | /api/menus/:id | 메뉴 상세 조회 | Table |
| POST | /api/menus | 메뉴 등록 | Admin |
| PUT | /api/menus/:id | 메뉴 수정 | Admin |
| DELETE | /api/menus/:id | 메뉴 삭제 | Admin |
| PUT | /api/menus/:id/order | 메뉴 노출 순서 변경 | Admin |
| GET | /api/categories | 카테고리 목록 조회 | Table |
| POST | /api/categories | 카테고리 등록 | Admin |
| PUT | /api/categories/:id | 카테고리 수정 | Admin |
| DELETE | /api/categories/:id | 카테고리 삭제 | Admin |

### 1.3 주문 (orderRoutes)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | /api/orders | 주문 생성 | Table |
| GET | /api/orders?tableId=X&sessionId=Y | 테이블 세션 주문 조회 | Table |
| GET | /api/orders/admin | 관리자용 전체 주문 조회 | Admin |
| PUT | /api/orders/:id/status | 주문 상태 변경 | Admin |
| DELETE | /api/orders/:id | 주문 삭제 | Admin |

### 1.4 테이블/세션 (tableRoutes)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /api/tables | 테이블 목록 조회 | Admin |
| POST | /api/tables | 테이블 등록/초기 설정 | Admin |
| PUT | /api/tables/:id | 테이블 정보 수정 | Admin |
| POST | /api/tables/:id/complete | 테이블 이용 완료 (세션 종료) | Admin |
| GET | /api/tables/:id/history | 테이블 과거 주문 내역 조회 | Admin |

### 1.5 SSE (sseRoutes)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /api/sse/orders | 관리자용 실시간 주문 스트림 | Admin |

---

## 2. 백엔드 서비스 메서드

### 2.1 authService
| 메서드 | Input | Output | 설명 |
|--------|-------|--------|------|
| loginAdmin(storeId, username, password) | 매장ID, 사용자명, 비밀번호 | { token, admin } | 관리자 로그인, JWT 발급 |
| loginTable(storeId, tableNumber, password) | 매장ID, 테이블번호, 비밀번호 | { token, table, session } | 테이블 로그인, 세션 반환 |
| verifyToken(token) | JWT 토큰 | { valid, payload } | 토큰 검증 |
| checkRateLimit(identifier) | IP/ID | boolean | 시도 제한 확인 |

### 2.2 menuService
| 메서드 | Input | Output | 설명 |
|--------|-------|--------|------|
| getAllMenus(storeId) | 매장ID | Menu[] (카테고리별 그룹) | 전체 메뉴 조회 |
| getMenuById(id) | 메뉴ID | Menu | 메뉴 상세 조회 |
| createMenu(menuData) | 메뉴 데이터 | Menu | 메뉴 등록 |
| updateMenu(id, menuData) | 메뉴ID, 데이터 | Menu | 메뉴 수정 |
| deleteMenu(id) | 메뉴ID | void | 메뉴 삭제 |
| updateMenuOrder(id, newOrder) | 메뉴ID, 순서 | void | 노출 순서 변경 |
| validateMenu(menuData) | 메뉴 데이터 | ValidationResult | 필수필드/가격 검증 |

### 2.3 orderService
| 메서드 | Input | Output | 설명 |
|--------|-------|--------|------|
| createOrder(orderData) | 주문 데이터 | Order | 주문 생성 |
| getOrdersBySession(tableId, sessionId) | 테이블ID, 세션ID | Order[] | 세션별 주문 조회 |
| getAllActiveOrders(storeId) | 매장ID | Order[] (테이블별 그룹) | 관리자용 활성 주문 조회 |
| updateOrderStatus(id, status) | 주문ID, 상태 | Order | 주문 상태 변경 |
| deleteOrder(id) | 주문ID | void | 주문 삭제, 총액 재계산 |
| calculateTableTotal(tableId, sessionId) | 테이블ID, 세션ID | number | 테이블 총 주문액 계산 |

### 2.4 tableService
| 메서드 | Input | Output | 설명 |
|--------|-------|--------|------|
| getAllTables(storeId) | 매장ID | Table[] | 테이블 목록 조회 |
| createTable(tableData) | 테이블 데이터 | Table | 테이블 등록 |
| updateTable(id, tableData) | 테이블ID, 데이터 | Table | 테이블 수정 |
| completeTable(tableId) | 테이블ID | void | 이용 완료 (세션 종료, 이력 이동) |
| getTableHistory(tableId, dateFilter) | 테이블ID, 날짜 | OrderHistory[] | 과거 내역 조회 |
| getOrCreateSession(tableId) | 테이블ID | Session | 현재 세션 조회 또는 생성 |

### 2.5 sseService
| 메서드 | Input | Output | 설명 |
|--------|-------|--------|------|
| addClient(res, storeId) | Response, 매장ID | void | SSE 클라이언트 등록 |
| removeClient(res) | Response | void | SSE 클라이언트 제거 |
| broadcastOrder(storeId, event, data) | 매장ID, 이벤트, 데이터 | void | 주문 이벤트 브로드캐스트 |

---

## 3. 프론트엔드 API 클라이언트 메서드

### 3.1 authApi
| 메서드 | 설명 |
|--------|------|
| adminLogin(storeId, username, password) | 관리자 로그인 |
| tableLogin(storeId, tableNumber, password) | 테이블 로그인 |
| verifyToken() | 토큰 유효성 검증 |

### 3.2 menuApi
| 메서드 | 설명 |
|--------|------|
| getMenus() | 메뉴 전체 조회 |
| getMenuById(id) | 메뉴 상세 조회 |
| createMenu(data) | 메뉴 등록 (Admin) |
| updateMenu(id, data) | 메뉴 수정 (Admin) |
| deleteMenu(id) | 메뉴 삭제 (Admin) |
| updateMenuOrder(id, order) | 메뉴 순서 변경 (Admin) |

### 3.3 orderApi
| 메서드 | 설명 |
|--------|------|
| createOrder(items) | 주문 생성 |
| getMyOrders() | 현재 세션 주문 조회 |
| getAllOrders() | 관리자용 전체 주문 조회 |
| updateOrderStatus(id, status) | 주문 상태 변경 (Admin) |
| deleteOrder(id) | 주문 삭제 (Admin) |

### 3.4 tableApi
| 메서드 | 설명 |
|--------|------|
| getTables() | 테이블 목록 (Admin) |
| createTable(data) | 테이블 등록 (Admin) |
| completeTable(id) | 이용 완료 (Admin) |
| getTableHistory(id, dateFilter) | 과거 내역 (Admin) |
