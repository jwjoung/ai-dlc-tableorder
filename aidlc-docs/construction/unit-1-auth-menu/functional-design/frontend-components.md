# Unit 1: 인증+메뉴 - Frontend Components

## 개요
Unit 1이 구현하는 프론트엔드 컴포넌트의 구조, 상태, 인터랙션을 정의합니다.

---

## 1. AuthContext (contexts/AuthContext.jsx)

### 상태
| 상태 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| token | string|null | localStorage에서 복원 | JWT 토큰 |
| role | string|null | localStorage에서 복원 | 'admin' 또는 'table' |
| user | object|null | null | 인증된 사용자 정보 |
| isAuthenticated | boolean | false | 인증 여부 |
| isLoading | boolean | true | 초기 인증 확인 중 |

### 메서드
| 메서드 | 설명 |
|--------|------|
| adminLogin(storeId, username, password) | 관리자 로그인 → token/role 저장 |
| tableLogin(storeId, tableNumber, password) | 테이블 로그인 → token/role/sessionId 저장 |
| logout() | token/role 제거, 상태 초기화 |
| verifyAuth() | 저장된 토큰 검증 (앱 시작 시) |

### localStorage 키
| 키 | 설명 |
|----|------|
| token | JWT 토큰 |
| tokenRole | 'admin' 또는 'table' |
| storeId | 매장 식별자 (테이블 자동 로그인용) |
| tableNumber | 테이블 번호 (테이블 자동 로그인용) |
| tablePassword | 테이블 비밀번호 (테이블 자동 로그인용) |
| sessionId | 현재 세션 ID |

### 초기화 플로우
```
App 로딩 → AuthContext 초기화
  → localStorage에 token 있음?
    → verifyAuth() 호출
      → 성공: isAuthenticated=true, user 설정
      → 실패: token/role 제거, isAuthenticated=false
  → token 없음: isAuthenticated=false
```

---

## 2. SetupPage (pages/customer/SetupPage.jsx)

### 역할
관리자가 태블릿에 1회 입력하는 초기 설정 화면. 이후 자동 로그인.

### Props
없음 (AuthContext 사용)

### 상태
| 상태 | 타입 | 설명 |
|------|------|------|
| storeId | string | 매장 식별자 입력 |
| tableNumber | string | 테이블 번호 입력 |
| password | string | 테이블 비밀번호 입력 |
| error | string|null | 에러 메시지 |
| isSubmitting | boolean | 제출 중 여부 |

### 플로우
```
SetupPage 렌더링
  → localStorage에 설정 정보 있음?
    → 자동 로그인 시도 (tableLogin)
      → 성공: /customer/menu로 이동
      → 실패: 에러 메시지 표시, 폼 표시
  → 설정 정보 없음: 폼 표시
    → 폼 제출
      → storeId, tableNumber, password를 localStorage에 저장
      → tableLogin 호출
        → 성공: /customer/menu로 이동
        → 실패: 에러 메시지 표시
```

### UI 구성
- 매장 식별자 입력 필드
- 테이블 번호 입력 필드
- 비밀번호 입력 필드
- 설정 완료 버튼
- 에러 메시지 영역

---

## 3. LoginPage (pages/admin/LoginPage.jsx)

### 역할
관리자 로그인 화면.

### Props
없음 (AuthContext 사용)

### 상태
| 상태 | 타입 | 설명 |
|------|------|------|
| storeId | string | 매장 식별자 입력 |
| username | string | 사용자명 입력 |
| password | string | 비밀번호 입력 |
| error | string|null | 에러 메시지 |
| isSubmitting | boolean | 제출 중 여부 |

### 플로우
```
LoginPage 렌더링
  → 이미 인증됨 (admin)? → /admin/dashboard로 리다이렉트
  → 폼 표시
    → 폼 제출
      → adminLogin 호출
        → 성공: /admin/dashboard로 이동
        → 실패: 에러 메시지 표시
```

### UI 구성
- 페이지 타이틀: "매장 관리자 로그인"
- 매장 식별자 입력 필드
- 사용자명 입력 필드
- 비밀번호 입력 필드
- 로그인 버튼
- 에러 메시지 영역

---

## 4. MenuPage (pages/customer/MenuPage.jsx)

### 역할
고객용 메뉴 조회 화면. 카테고리 탭 + 메뉴 카드 그리드 + 상세 모달.

### Props
없음 (AuthContext, CartContext 사용)

### 상태
| 상태 | 타입 | 설명 |
|------|------|------|
| categories | array | 카테고리별 메뉴 데이터 |
| selectedCategory | number|null | 선택된 카테고리 ID (null=전체) |
| selectedMenu | object|null | 상세 보기 중인 메뉴 |
| isDetailOpen | boolean | 상세 모달 열림 여부 |
| isLoading | boolean | 데이터 로딩 중 |
| error | string|null | 에러 메시지 |

### 플로우
```
MenuPage 렌더링
  → 인증 안됨? → /customer/setup으로 리다이렉트
  → menuApi.getMenus() 호출
  → 카테고리 탭 + 메뉴 카드 그리드 표시
  → 카테고리 탭 클릭 → selectedCategory 변경 → 해당 카테고리 메뉴 필터
  → 메뉴 카드 클릭 → 상세 모달 표시
  → 카드 "+" 버튼 클릭 → 장바구니에 추가 (CartContext)
  → 모달에서 "장바구니 추가" 클릭 → 장바구니에 추가 (CartContext)
```

### UI 구성
- 상단: 카테고리 탭 바 (가로 스크롤, 전체 탭 포함)
- 메인: 메뉴 카드 그리드 (2열)
  - 카드: 이미지, 메뉴명, 가격, "+" 버튼
- 하단 네비게이션: 메뉴(활성), 장바구니, 주문내역
- 상세 모달: 이미지, 메뉴명, 가격, 설명, 수량 선택, 장바구니 추가 버튼

### 장바구니 추가 인터랙션
- 카드 "+" 버튼: 수량 1로 즉시 추가 (이미 있으면 수량 +1)
- 상세 모달: 수량 선택 후 추가

---

## 5. MenuManagementPage (pages/admin/MenuManagementPage.jsx)

### 역할
관리자 메뉴 CRUD 관리. 사이드바(카테고리) + 메인(메뉴 목록).

### Props
없음 (AuthContext 사용)

### 상태
| 상태 | 타입 | 설명 |
|------|------|------|
| categories | array | 카테고리 목록 |
| menus | array | 현재 카테고리의 메뉴 목록 |
| selectedCategoryId | number|null | 선택된 카테고리 |
| isMenuFormOpen | boolean | 메뉴 등록/수정 폼 열림 |
| isCategoryFormOpen | boolean | 카테고리 등록/수정 폼 열림 |
| editingMenu | object|null | 수정 중인 메뉴 (null이면 신규) |
| editingCategory | object|null | 수정 중인 카테고리 |
| isLoading | boolean | 로딩 중 |
| error | string|null | 에러 메시지 |

### UI 구성 - 레이아웃
```
+------------------+-------------------------------+
| 사이드바          | 메인 영역                      |
| (카테고리 목록)    | (메뉴 목록 테이블)              |
|                  |                               |
| [+ 카테고리 추가]  | [+ 메뉴 추가]                  |
| - 메인메뉴 [수정]  | 메뉴명  가격  상태  순서  액션   |
| - 사이드메뉴 [수정] | 김치찌개 9000  활성  ^v  수정 삭제|
| - 음료 [수정]     | 된장찌개 8000  활성  ^v  수정 삭제|
|   [삭제]         |                               |
+------------------+-------------------------------+
```

### 메뉴 등록/수정 폼 (모달)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | text input | Y | 메뉴명 |
| price | number input | Y | 가격 |
| description | textarea | N | 설명 |
| image_url | text input | N | 이미지 URL |
| category_id | select | Y | 카테고리 선택 |

### 플로우
```
관리자 인증 확인 → 인증 안됨? → /admin/login

카테고리 관리:
  - 추가: [+ 카테고리 추가] → 이름 입력 모달 → 저장
  - 수정: [수정] 버튼 → 이름 수정 모달 → 저장
  - 삭제: [삭제] 버튼 → 확인 팝업 → 삭제 (메뉴 있으면 에러)

메뉴 관리:
  - 카테고리 선택 → 해당 카테고리 메뉴 표시
  - 추가: [+ 메뉴 추가] → 폼 모달 → 저장
  - 수정: [수정] 버튼 → 폼 모달 (기존 데이터 채워짐) → 저장
  - 삭제: [삭제] 버튼 → 확인 팝업 → 소프트 삭제
  - 순서: ^ (위) / v (아래) 버튼 → 인접 메뉴와 순서 교환
```

---

## 6. API 클라이언트 모듈

### authApi (api/authApi.js)
| 메서드 | HTTP | URL | Body |
|--------|------|-----|------|
| adminLogin(storeId, username, password) | POST | /auth/admin/login | { storeIdentifier, username, password } |
| tableLogin(storeId, tableNumber, password) | POST | /auth/table/login | { storeIdentifier, tableNumber, password } |
| verifyToken() | POST | /auth/verify | (none, token in header) |

### menuApi (api/menuApi.js)
| 메서드 | HTTP | URL | Body |
|--------|------|-----|------|
| getMenus() | GET | /menus | - |
| getMenuById(id) | GET | /menus/:id | - |
| createMenu(data) | POST | /menus | { name, price, description, image_url, category_id } |
| updateMenu(id, data) | PUT | /menus/:id | { name, price, description, image_url, category_id } |
| deleteMenu(id) | DELETE | /menus/:id | - |
| updateMenuOrder(id, direction) | PUT | /menus/:id/order | { direction } |
| getCategories() | GET | /categories | - |
| createCategory(data) | POST | /categories | { name } |
| updateCategory(id, data) | PUT | /categories/:id | { name } |
| deleteCategory(id) | DELETE | /categories/:id | - |

---

## 7. 라우팅 변경사항 (App.jsx)

### Unit 1에서 활성화하는 라우트
| 경로 | 컴포넌트 | 인증 |
|------|---------|------|
| /customer/setup | SetupPage | 없음 |
| /customer/menu | MenuPage | table 인증 필요 |
| /admin/login | LoginPage | 없음 |
| /admin/menus | MenuManagementPage | admin 인증 필요 |

### 기본 리다이렉트
- `/` → `/customer/setup` (인증 안됨) 또는 `/customer/menu` (테이블 인증됨)
- `/admin` → `/admin/login` (인증 안됨) 또는 `/admin/dashboard` (관리자 인증됨)

---

## 8. 하단 네비게이션 바 (고객용)

### 탭 구성
| 탭 | 경로 | 아이콘 | Unit |
|----|------|--------|------|
| 메뉴 | /customer/menu | 메뉴 아이콘 | Unit 1 |
| 장바구니 | /customer/cart | 장바구니 아이콘 + 뱃지 | Unit 2 |
| 주문내역 | /customer/orders | 목록 아이콘 | Unit 2 |

Unit 1에서는 메뉴 탭만 활성, 장바구니/주문내역은 Unit 2에서 활성화.
