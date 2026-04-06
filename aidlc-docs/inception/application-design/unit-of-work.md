# Unit of Work 정의 - 테이블오더 서비스

## 분해 전략
- **방식**: 기능 도메인별 수직 분할 (Vertical Slice) + 공통 기반
- **개발 인원**: 3명 병렬 개발
- **개발 순서**: Phase 0 (공통 기반) → Unit 1, 2, 3 병렬 → Build & Test
- **아키텍처**: Monolith (단일 배포 단위)

---

## Unit 0: Foundation (공통 기반)

### 담당: Dev 1 (이후 Unit 1 담당자)

### 범위
프로젝트 골격, DB 스키마, 공통 미들웨어, 공통 UI 컴포넌트

### 책임
**Backend:**
- Express 앱 골격 (app.js, server.js, 라우터 등록)
- SQLite 데이터베이스 연결 및 스키마 생성 (전체 10개 테이블)
- DB seed (관리자 계정, 샘플 매장, 테이블, 카테고리, 메뉴)
- 공통 미들웨어 (errorHandler, authMiddleware, tableAuthMiddleware, rateLimiter)
- 프로젝트 package.json (루트, server)

**Frontend:**
- Vite + React + Tailwind CSS 프로젝트 초기화
- 공통 UI 컴포넌트 (Button, Modal, Loading, ErrorMessage, Card)
- API 클라이언트 기반 (apiClient.js - JWT 헤더, 에러 처리)
- 라우팅 골격 (App.jsx - /customer/*, /admin/*)
- 프로젝트 package.json (client)

### 산출물
```
table-order/
+-- package.json                  # 루트 스크립트
+-- server/
|   +-- package.json
|   +-- src/
|       +-- app.js                # Express 앱 설정
|       +-- server.js             # 서버 시작점
|       +-- db/
|       |   +-- database.js       # SQLite 연결
|       |   +-- schema.sql        # 전체 DDL
|       |   +-- seed.js           # 초기 데이터
|       +-- middleware/
|       |   +-- authMiddleware.js
|       |   +-- tableAuthMiddleware.js
|       |   +-- errorHandler.js
|       |   +-- rateLimiter.js
|       +-- routes/               # (빈 라우터 등록 골격)
|       +-- controllers/          # (빈 디렉토리)
|       +-- services/             # (빈 디렉토리)
|       +-- repositories/         # (빈 디렉토리)
+-- client/
    +-- package.json
    +-- index.html
    +-- vite.config.js
    +-- tailwind.config.js
    +-- postcss.config.js
    +-- src/
        +-- main.jsx
        +-- App.jsx               # 라우팅 골격
        +-- api/
        |   +-- apiClient.js      # HTTP 클라이언트 기반
        +-- components/
        |   +-- Button.jsx
        |   +-- Modal.jsx
        |   +-- Loading.jsx
        |   +-- ErrorMessage.jsx
        |   +-- Card.jsx
        +-- contexts/             # (빈 디렉토리)
        +-- pages/
            +-- customer/         # (빈 디렉토리)
            +-- admin/            # (빈 디렉토리)
```

### 완료 기준
- `npm install` 성공 (server, client)
- `npm run seed` 실행 시 DB 생성 및 초기 데이터 삽입
- Express 서버 기동 확인
- Vite 개발 서버 기동 및 라우팅 골격 동작 확인
- 공통 UI 컴포넌트 렌더링 확인

---

## Unit 1: 인증 + 메뉴 도메인 (Dev 1)

### 범위
인증(관리자/테이블) 및 메뉴/카테고리 관리 전체 스택

### 책임
**Backend:**
- authRoutes, authController, authService
- menuRoutes, menuController, menuService
- adminRepository, menuRepository
- JWT 발급/검증 로직, bcrypt 비밀번호 검증
- 메뉴/카테고리 CRUD, 순서 조정, 데이터 검증

**Frontend:**
- AuthContext (인증 상태, JWT 토큰, 로그인/로그아웃)
- authApi, menuApi
- SetupPage (테이블 초기 설정 입력, localStorage 저장)
- LoginPage (관리자 로그인)
- MenuPage (카테고리 탭, 메뉴 카드 그리드, 상세 보기)
- MenuManagementPage (메뉴 CRUD, 순서 조정)

### API 엔드포인트
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/auth/admin/login | 관리자 로그인 |
| POST | /api/auth/table/login | 테이블 로그인 |
| POST | /api/auth/verify | 토큰 검증 |
| GET | /api/menus | 메뉴 전체 조회 |
| GET | /api/menus/:id | 메뉴 상세 |
| POST | /api/menus | 메뉴 등록 |
| PUT | /api/menus/:id | 메뉴 수정 |
| DELETE | /api/menus/:id | 메뉴 삭제 |
| PUT | /api/menus/:id/order | 순서 변경 |
| GET | /api/categories | 카테고리 조회 |
| POST | /api/categories | 카테고리 등록 |
| PUT | /api/categories/:id | 카테고리 수정 |
| DELETE | /api/categories/:id | 카테고리 삭제 |

### 완료 기준
- 관리자/테이블 로그인 API 정상 동작, JWT 발급 확인
- 메뉴/카테고리 CRUD API 정상 동작
- 고객 SetupPage → 자동 로그인 → MenuPage 플로우 동작
- 관리자 LoginPage → MenuManagementPage 플로우 동작

---

## Unit 2: 주문 + 모니터링 도메인 (Dev 2)

### 범위
주문 생성/조회/상태 관리, SSE 실시간 모니터링, 장바구니 전체 스택

### 책임
**Backend:**
- orderRoutes, orderController, orderService
- sseRoutes, sseController, sseService
- orderRepository
- 주문 생성/조회/상태변경/삭제 로직, 총액 계산
- SSE 클라이언트 관리, 이벤트 브로드캐스트

**Frontend:**
- CartContext (장바구니 상태, localStorage 연동)
- orderApi, sseClient
- CartPage (장바구니 관리, 수량 조절, 주문 확정)
- OrderSuccessPage (주문번호 5초 표시, 자동 리다이렉트)
- OrderHistoryPage (고객 - 현재 세션 주문 내역)
- DashboardPage (관리자 - 테이블별 그리드, SSE 실시간 업데이트, 주문 상태 변경)

### API 엔드포인트
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/orders | 주문 생성 |
| GET | /api/orders?tableId&sessionId | 세션별 주문 조회 |
| GET | /api/orders/admin | 관리자 전체 주문 조회 |
| PUT | /api/orders/:id/status | 주문 상태 변경 |
| DELETE | /api/orders/:id | 주문 삭제 |
| GET | /api/sse/orders | 실시간 주문 스트림 |

### 완료 기준
- 주문 생성 → SSE 이벤트 발생 확인
- 주문 상태 변경 → SSE 이벤트 발생 확인
- 고객 장바구니 → 주문 → 성공화면 → 내역 조회 플로우 동작
- 관리자 DashboardPage 실시간 업데이트 동작

---

## Unit 3: 테이블 관리 도메인 (Dev 3)

### 범위
테이블 설정, 세션 관리, 이용 완료, 과거 내역 전체 스택

### 책임
**Backend:**
- tableRoutes, tableController, tableService
- tableRepository, sessionRepository, orderHistoryRepository
- 테이블 등록/수정, 세션 생성/종료
- 이용 완료 (주문 → 이력 이동, 리셋)
- 과거 내역 조회 (날짜 필터)

**Frontend:**
- tableApi
- TableSettingsPage (관리자 - 테이블 등록/설정)
- TableDetailModal (관리자 - 주문 상세, 주문 삭제 확인 팝업)
- OrderHistoryModal (관리자 - 과거 내역, 날짜 필터)
- DashboardPage 내 이용 완료 버튼/확인 팝업 (Dev 2와 협업)

### API 엔드포인트
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/tables | 테이블 목록 조회 |
| POST | /api/tables | 테이블 등록 |
| PUT | /api/tables/:id | 테이블 수정 |
| POST | /api/tables/:id/complete | 이용 완료 |
| GET | /api/tables/:id/history | 과거 내역 조회 |

### 완료 기준
- 테이블 등록/수정 API 정상 동작
- 이용 완료 시 주문 → 이력 이동, 현재 주문 리셋 확인
- 과거 내역 조회 (날짜 필터) 동작
- TableSettingsPage, TableDetailModal, OrderHistoryModal 동작

### 협업 포인트
- **Dev 2와 공유**: DashboardPage에서 이용 완료 버튼은 Dev 3가 구현, 대시보드 레이아웃은 Dev 2가 구현
- **Dev 2와 공유**: 주문 삭제 API (DELETE /api/orders/:id)는 Dev 2 orderRoutes에 구현되어 있으나, UI 호출은 Dev 3 TableDetailModal에서 수행

---

## 코드 구성 전략 (Greenfield)

```
table-order/                        # 프로젝트 루트
+-- package.json                    # 루트 (concurrently 스크립트)
+-- server/                         # Backend
|   +-- package.json
|   +-- src/
|       +-- app.js                  # [Unit 0]
|       +-- server.js               # [Unit 0]
|       +-- db/                     # [Unit 0]
|       +-- middleware/             # [Unit 0]
|       +-- routes/
|       |   +-- authRoutes.js       # [Unit 1]
|       |   +-- menuRoutes.js       # [Unit 1]
|       |   +-- orderRoutes.js      # [Unit 2]
|       |   +-- sseRoutes.js        # [Unit 2]
|       |   +-- tableRoutes.js      # [Unit 3]
|       +-- controllers/
|       |   +-- authController.js   # [Unit 1]
|       |   +-- menuController.js   # [Unit 1]
|       |   +-- orderController.js  # [Unit 2]
|       |   +-- sseController.js    # [Unit 2]
|       |   +-- tableController.js  # [Unit 3]
|       +-- services/
|       |   +-- authService.js      # [Unit 1]
|       |   +-- menuService.js      # [Unit 1]
|       |   +-- orderService.js     # [Unit 2]
|       |   +-- sseService.js       # [Unit 2]
|       |   +-- tableService.js     # [Unit 3]
|       +-- repositories/
|           +-- adminRepository.js  # [Unit 1]
|           +-- menuRepository.js   # [Unit 1]
|           +-- orderRepository.js  # [Unit 2]
|           +-- tableRepository.js  # [Unit 3]
|           +-- sessionRepository.js # [Unit 3]
|           +-- orderHistoryRepository.js # [Unit 3]
+-- client/                         # Frontend
    +-- package.json                # [Unit 0]
    +-- src/
        +-- App.jsx                 # [Unit 0]
        +-- api/
        |   +-- apiClient.js        # [Unit 0]
        |   +-- authApi.js          # [Unit 1]
        |   +-- menuApi.js          # [Unit 1]
        |   +-- orderApi.js         # [Unit 2]
        |   +-- sseClient.js        # [Unit 2]
        |   +-- tableApi.js         # [Unit 3]
        +-- components/             # [Unit 0]
        +-- contexts/
        |   +-- AuthContext.jsx      # [Unit 1]
        |   +-- CartContext.jsx      # [Unit 2]
        +-- pages/
            +-- customer/
            |   +-- SetupPage.jsx        # [Unit 1]
            |   +-- MenuPage.jsx         # [Unit 1]
            |   +-- CartPage.jsx         # [Unit 2]
            |   +-- OrderSuccessPage.jsx # [Unit 2]
            |   +-- OrderHistoryPage.jsx # [Unit 2]
            +-- admin/
                +-- LoginPage.jsx          # [Unit 1]
                +-- DashboardPage.jsx      # [Unit 2 + Unit 3 협업]
                +-- TableDetailModal.jsx   # [Unit 3]
                +-- OrderHistoryModal.jsx  # [Unit 3]
                +-- MenuManagementPage.jsx # [Unit 1]
                +-- TableSettingsPage.jsx  # [Unit 3]
```

## 개발 타임라인

```
Phase 0 (Dev 1):  ████████
                          |
Unit 1 (Dev 1):           ████████████████████
Unit 2 (Dev 2):           ████████████████████
Unit 3 (Dev 3):           ████████████████████
                                              |
Build & Test:                                 ████████
```
