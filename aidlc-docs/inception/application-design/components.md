# 컴포넌트 정의 - 테이블오더 서비스

---

## 1. 프론트엔드 (React + Vite + Tailwind CSS)

### 1.1 공통 컴포넌트 (shared/)
| 컴포넌트 | 책임 |
|----------|------|
| Button | 공통 버튼 (터치 친화적, 최소 44x44px) |
| Modal | 확인/경고 팝업 모달 |
| Loading | 로딩 스피너 |
| ErrorMessage | 에러 메시지 표시 |
| Card | 카드 레이아웃 컴포넌트 |

### 1.2 고객 페이지 (pages/customer/)
| 페이지 | 책임 |
|--------|------|
| SetupPage | 테이블 초기 설정 (매장ID, 테이블번호, 비밀번호 입력) |
| MenuPage | 메뉴 조회/탐색 (카테고리 탭, 메뉴 카드 그리드) - 기본 화면 |
| CartPage | 장바구니 관리 (수량 조절, 총액 표시, 주문 확정) |
| OrderSuccessPage | 주문 성공 화면 (주문번호 5초 표시 후 리다이렉트) |
| OrderHistoryPage | 현재 세션 주문 내역 조회 |

### 1.3 관리자 페이지 (pages/admin/)
| 페이지 | 책임 |
|--------|------|
| LoginPage | 관리자 로그인 (매장ID, 사용자명, 비밀번호) |
| DashboardPage | 실시간 주문 모니터링 대시보드 (테이블별 그리드) |
| TableDetailModal | 테이블 주문 상세 보기 (주문 목록, 상태 변경, 삭제) |
| OrderHistoryModal | 과거 주문 내역 조회 (날짜 필터) |
| MenuManagementPage | 메뉴 CRUD 관리 |
| TableSettingsPage | 테이블 초기 설정 관리 |

### 1.4 컨텍스트 (contexts/)
| 컨텍스트 | 책임 |
|----------|------|
| AuthContext | 인증 상태 관리 (JWT 토큰, 로그인/로그아웃) |
| CartContext | 장바구니 상태 관리 (localStorage 연동) |

### 1.5 API 클라이언트 (api/)
| 모듈 | 책임 |
|------|------|
| apiClient | Axios/fetch 기반 HTTP 클라이언트 (JWT 헤더 자동 첨부) |
| authApi | 인증 관련 API 호출 |
| menuApi | 메뉴 관련 API 호출 |
| orderApi | 주문 관련 API 호출 |
| tableApi | 테이블/세션 관련 API 호출 |
| sseClient | SSE 연결 관리 (실시간 주문 업데이트) |

---

## 2. 백엔드 (Node.js + Express)

### 2.1 라우트 (routes/)
| 라우트 | 책임 |
|--------|------|
| authRoutes | 인증 관련 엔드포인트 (/api/auth/*) |
| menuRoutes | 메뉴 관련 엔드포인트 (/api/menus/*) |
| orderRoutes | 주문 관련 엔드포인트 (/api/orders/*) |
| tableRoutes | 테이블/세션 관련 엔드포인트 (/api/tables/*) |
| sseRoutes | SSE 스트림 엔드포인트 (/api/sse/*) |

### 2.2 컨트롤러 (controllers/)
| 컨트롤러 | 책임 |
|----------|------|
| authController | 인증 요청 처리, 응답 생성 |
| menuController | 메뉴 요청 처리, 응답 생성 |
| orderController | 주문 요청 처리, 응답 생성 |
| tableController | 테이블/세션 요청 처리, 응답 생성 |
| sseController | SSE 연결 관리, 이벤트 전송 |

### 2.3 서비스 (services/)
| 서비스 | 책임 |
|--------|------|
| authService | 인증 로직 (JWT 발급/검증, 비밀번호 검증, 시도 제한) |
| menuService | 메뉴 비즈니스 로직 (CRUD, 순서 조정, 검증) |
| orderService | 주문 비즈니스 로직 (생성, 상태 변경, 삭제, 총액 계산) |
| tableService | 테이블/세션 로직 (세션 생성/종료, 이력 이동) |
| sseService | SSE 클라이언트 관리, 이벤트 브로드캐스트 |

### 2.4 리포지토리 (repositories/)
| 리포지토리 | 책임 |
|------------|------|
| menuRepository | 메뉴 데이터 CRUD |
| orderRepository | 주문 데이터 CRUD |
| tableRepository | 테이블 데이터 CRUD |
| sessionRepository | 세션 데이터 CRUD |
| orderHistoryRepository | 주문 이력 데이터 CRUD |
| adminRepository | 관리자 계정 데이터 조회 |

### 2.5 미들웨어 (middleware/)
| 미들웨어 | 책임 |
|----------|------|
| authMiddleware | JWT 토큰 검증, 요청 인증 |
| tableAuthMiddleware | 테이블 자동 로그인 인증 |
| errorHandler | 전역 에러 핸들링 |
| rateLimiter | 로그인 시도 제한 |

---

## 3. 데이터베이스 (SQLite)

### 3.1 테이블 정의
| 테이블 | 책임 |
|--------|------|
| stores | 매장 정보 |
| admins | 관리자 계정 (bcrypt 해시 비밀번호) |
| tables | 테이블 정보 (번호, 비밀번호) |
| table_sessions | 테이블 세션 (시작/종료 시각) |
| categories | 메뉴 카테고리 |
| menu_items | 메뉴 항목 (이름, 가격, 설명, 이미지URL, 순서) |
| orders | 주문 (세션ID, 테이블ID, 상태, 총액) |
| order_items | 주문 항목 (메뉴ID, 수량, 단가) |
| order_history | 과거 주문 이력 (이용 완료된 주문) |
| order_history_items | 과거 주문 항목 이력 |
