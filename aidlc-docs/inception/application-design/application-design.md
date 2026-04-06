# Application Design - 테이블오더 서비스 (통합)

---

## 1. 설계 결정 요약

| 항목 | 결정 |
|------|------|
| 프론트엔드 구성 | Hybrid (페이지: 기능별, 공통: 계층별) |
| 상태 관리 | React Context API |
| API 설계 | RESTful Resource-Based |
| 백엔드 구조 | Layered Architecture (Routes → Controllers → Services → Repositories) |
| UI 스타일링 | Tailwind CSS |
| 실시간 통신 | SSE (Server-Sent Events) |
| 인증 | JWT + bcrypt |
| 데이터베이스 | SQLite |

---

## 2. 프로젝트 구조

```
table-order/
+-- client/                     # React Frontend
|   +-- src/
|   |   +-- api/                # API 클라이언트
|   |   |   +-- apiClient.js
|   |   |   +-- authApi.js
|   |   |   +-- menuApi.js
|   |   |   +-- orderApi.js
|   |   |   +-- tableApi.js
|   |   |   +-- sseClient.js
|   |   +-- components/         # 공통 UI 컴포넌트
|   |   |   +-- Button.jsx
|   |   |   +-- Modal.jsx
|   |   |   +-- Loading.jsx
|   |   |   +-- ErrorMessage.jsx
|   |   |   +-- Card.jsx
|   |   +-- contexts/           # React Context
|   |   |   +-- AuthContext.jsx
|   |   |   +-- CartContext.jsx
|   |   +-- pages/
|   |   |   +-- customer/       # 고객 페이지
|   |   |   |   +-- SetupPage.jsx
|   |   |   |   +-- MenuPage.jsx
|   |   |   |   +-- CartPage.jsx
|   |   |   |   +-- OrderSuccessPage.jsx
|   |   |   |   +-- OrderHistoryPage.jsx
|   |   |   +-- admin/          # 관리자 페이지
|   |   |       +-- LoginPage.jsx
|   |   |       +-- DashboardPage.jsx
|   |   |       +-- TableDetailModal.jsx
|   |   |       +-- OrderHistoryModal.jsx
|   |   |       +-- MenuManagementPage.jsx
|   |   |       +-- TableSettingsPage.jsx
|   |   +-- App.jsx
|   |   +-- main.jsx
|   +-- index.html
|   +-- vite.config.js
|   +-- tailwind.config.js
|   +-- package.json
+-- server/                     # Express Backend
|   +-- src/
|   |   +-- routes/
|   |   |   +-- authRoutes.js
|   |   |   +-- menuRoutes.js
|   |   |   +-- orderRoutes.js
|   |   |   +-- tableRoutes.js
|   |   |   +-- sseRoutes.js
|   |   +-- controllers/
|   |   |   +-- authController.js
|   |   |   +-- menuController.js
|   |   |   +-- orderController.js
|   |   |   +-- tableController.js
|   |   |   +-- sseController.js
|   |   +-- services/
|   |   |   +-- authService.js
|   |   |   +-- menuService.js
|   |   |   +-- orderService.js
|   |   |   +-- tableService.js
|   |   |   +-- sseService.js
|   |   +-- repositories/
|   |   |   +-- adminRepository.js
|   |   |   +-- menuRepository.js
|   |   |   +-- orderRepository.js
|   |   |   +-- tableRepository.js
|   |   |   +-- sessionRepository.js
|   |   |   +-- orderHistoryRepository.js
|   |   +-- middleware/
|   |   |   +-- authMiddleware.js
|   |   |   +-- tableAuthMiddleware.js
|   |   |   +-- errorHandler.js
|   |   |   +-- rateLimiter.js
|   |   +-- db/
|   |   |   +-- database.js      # SQLite 연결 및 초기화
|   |   |   +-- schema.sql       # 테이블 생성 DDL
|   |   |   +-- seed.js          # 초기 데이터 (관리자 계정, 샘플 메뉴)
|   |   +-- app.js               # Express 앱 설정
|   |   +-- server.js            # 서버 시작점
|   +-- package.json
+-- package.json                 # 루트 (workspaces 또는 스크립트)
```

---

## 3. 데이터베이스 스키마 (개요)

### stores
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 매장 ID |
| name | TEXT | 매장명 |
| store_identifier | TEXT UNIQUE | 매장 식별자 |

### admins
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 관리자 ID |
| store_id | INTEGER FK | 매장 ID |
| username | TEXT | 사용자명 |
| password_hash | TEXT | bcrypt 해시 비밀번호 |

### tables
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 테이블 ID |
| store_id | INTEGER FK | 매장 ID |
| table_number | INTEGER | 테이블 번호 |
| password_hash | TEXT | bcrypt 해시 비밀번호 |

### table_sessions
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 세션 ID |
| table_id | INTEGER FK | 테이블 ID |
| started_at | DATETIME | 세션 시작 시각 |
| ended_at | DATETIME NULL | 세션 종료 시각 |
| is_active | BOOLEAN | 활성 여부 |

### categories
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 카테고리 ID |
| store_id | INTEGER FK | 매장 ID |
| name | TEXT | 카테고리명 |
| display_order | INTEGER | 노출 순서 |

### menu_items
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 메뉴 ID |
| category_id | INTEGER FK | 카테고리 ID |
| store_id | INTEGER FK | 매장 ID |
| name | TEXT | 메뉴명 |
| price | INTEGER | 가격 (원) |
| description | TEXT | 설명 |
| image_url | TEXT | 이미지 URL |
| display_order | INTEGER | 노출 순서 |
| is_available | BOOLEAN | 판매 가능 여부 |

### orders
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 주문 ID |
| store_id | INTEGER FK | 매장 ID |
| table_id | INTEGER FK | 테이블 ID |
| session_id | INTEGER FK | 세션 ID |
| order_number | TEXT | 주문 번호 |
| status | TEXT | 상태 (pending/preparing/completed) |
| total_amount | INTEGER | 총 금액 |
| created_at | DATETIME | 주문 시각 |

### order_items
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 항목 ID |
| order_id | INTEGER FK | 주문 ID |
| menu_item_id | INTEGER FK | 메뉴 ID |
| menu_name | TEXT | 주문 시점 메뉴명 (스냅샷) |
| quantity | INTEGER | 수량 |
| unit_price | INTEGER | 주문 시점 단가 (스냅샷) |

### order_history
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 이력 ID |
| store_id | INTEGER FK | 매장 ID |
| table_id | INTEGER FK | 테이블 ID |
| session_id | INTEGER | 원본 세션 ID |
| order_number | TEXT | 주문 번호 |
| status | TEXT | 최종 상태 |
| total_amount | INTEGER | 총 금액 |
| ordered_at | DATETIME | 원본 주문 시각 |
| completed_at | DATETIME | 이용 완료 시각 |

### order_history_items
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 항목 ID |
| order_history_id | INTEGER FK | 이력 ID |
| menu_name | TEXT | 메뉴명 |
| quantity | INTEGER | 수량 |
| unit_price | INTEGER | 단가 |

---

## 4. API 엔드포인트 요약

- **인증**: 3개 (관리자 로그인, 테이블 로그인, 토큰 검증)
- **메뉴**: 8개 (메뉴 CRUD + 순서 변경, 카테고리 CRUD)
- **주문**: 5개 (생성, 세션별 조회, 관리자 조회, 상태 변경, 삭제)
- **테이블**: 5개 (목록, 등록, 수정, 이용 완료, 과거 내역)
- **SSE**: 1개 (실시간 주문 스트림)
- **총 22개 엔드포인트**

---

## 5. 핵심 통신 패턴

| 패턴 | 용도 |
|------|------|
| REST (HTTP) | 모든 CRUD 작업, 인증 |
| SSE (단방향 스트림) | 관리자 실시간 주문 모니터링 |
| localStorage | 고객 장바구니, 테이블 인증 정보 |

자세한 내용은 개별 설계 문서를 참조하세요:
- [components.md](components.md) - 컴포넌트 정의
- [component-methods.md](component-methods.md) - 메서드 정의
- [services.md](services.md) - 서비스 레이어 설계
- [component-dependency.md](component-dependency.md) - 의존성 관계
