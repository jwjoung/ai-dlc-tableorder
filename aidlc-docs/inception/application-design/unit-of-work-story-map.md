# Unit of Work - Story Map - 테이블오더 서비스

---

## Unit 0: Foundation (공통 기반)

| 항목 | 내용 |
|------|------|
| Backend | DB 스키마 10개 테이블, seed, Express 골격, 미들웨어 4개 |
| Frontend | Vite+React+Tailwind 초기화, 공통 UI 5개, apiClient, 라우팅 골격 |
| 스토리 매핑 | 직접 매핑 없음 (인프라 기반) |

---

## Unit 1: 인증 + 메뉴 (Dev 1)

| Story ID | 스토리 | Backend | Frontend |
|----------|--------|---------|----------|
| US-C01 | 테이블 자동 로그인 | authRoutes, authService (table login) | SetupPage, AuthContext |
| US-C02 | 메뉴 조회 및 탐색 | menuRoutes (GET), menuService | MenuPage |
| US-A01 | 매장 관리자 로그인 | authRoutes, authService (admin login) | LoginPage, AuthContext |
| US-A08 | 메뉴 등록 | menuRoutes (POST), menuService | MenuManagementPage |
| US-A09 | 메뉴 수정 및 삭제 | menuRoutes (PUT/DELETE) | MenuManagementPage |
| US-A10 | 메뉴 노출 순서 조정 | menuRoutes (PUT order) | MenuManagementPage |

**총 6개 스토리**

---

## Unit 2: 주문 + 모니터링 (Dev 2)

| Story ID | 스토리 | Backend | Frontend |
|----------|--------|---------|----------|
| US-C03 | 장바구니에 메뉴 추가 | (없음) | CartPage, CartContext |
| US-C04 | 주문 생성 및 확인 | orderRoutes (POST), orderService | CartPage, OrderSuccessPage |
| US-C05 | 주문 내역 조회 | orderRoutes (GET session) | OrderHistoryPage |
| US-A02 | 실시간 주문 모니터링 | orderRoutes (GET admin), sseRoutes, sseService | DashboardPage (레이아웃+SSE) |
| US-A03 | 주문 상태 변경 | orderRoutes (PUT status) | DashboardPage (상태 버튼) |

**총 5개 스토리**

---

## Unit 3: 테이블 관리 (Dev 3)

| Story ID | 스토리 | Backend | Frontend |
|----------|--------|---------|----------|
| US-A04 | 테이블 초기 설정 | tableRoutes (POST), tableService | TableSettingsPage |
| US-A05 | 주문 삭제 | (API는 Unit 2) | TableDetailModal (삭제 UI) |
| US-A06 | 테이블 이용 완료 | tableRoutes (complete), tableService | DashboardPage (이용완료 버튼) |
| US-A07 | 과거 주문 내역 조회 | tableRoutes (history), tableService | OrderHistoryModal |

**총 4개 스토리**

---

## 매핑 검증

| 항목 | 수치 |
|------|------|
| 전체 스토리 | 15개 |
| Unit 1 매핑 | 6개 |
| Unit 2 매핑 | 5개 |
| Unit 3 매핑 | 4개 |
| 합계 | 15개 |
| 미할당 스토리 | 0개 |

## 교차 의존 스토리

| Story ID | 주 담당 | 보조 담당 | 내용 |
|----------|--------|----------|------|
| US-A05 | Unit 3 (UI) | Unit 2 (API) | 주문 삭제 API는 Unit 2, UI 호출은 Unit 3 |
| US-A02 | Unit 2 (레이아웃) | Unit 3 (이용완료) | DashboardPage 공유 |
