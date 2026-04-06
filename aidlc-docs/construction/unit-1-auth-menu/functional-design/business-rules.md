# Unit 1: 인증+메뉴 - Business Rules

## 개요
Unit 1의 비즈니스 규칙, 검증 로직, 제약 조건을 정의합니다.

---

## 1. 인증 규칙

### BR-AUTH-01: 관리자 JWT 토큰
- **페이로드**: `{ id, storeId, username, role: 'admin' }`
- **만료**: 16시간 (57600초)
- **알고리즘**: HS256

### BR-AUTH-02: 테이블 JWT 토큰
- **페이로드**: `{ id, storeId, tableNumber, sessionId, role: 'table' }`
- **만료**: 24시간 (86400초)
- **알고리즘**: HS256

### BR-AUTH-03: 비밀번호 해싱
- **알고리즘**: bcrypt
- **salt rounds**: 10 (seed.js 기준)
- **검증**: bcrypt.compare(plaintext, hash)

### BR-AUTH-04: 로그인 시도 제한
- **최대 시도**: 10회 / 15분 (Unit 0 rateLimiter 기준)
- **차단 단위**: IP 주소
- **성공 시**: 실패 카운터 초기화
- **차단 시**: 429 응답 + 남은 시간 안내

### BR-AUTH-05: 에러 메시지 일반화
- 관리자 로그인 실패 시 "아이디 또는 비밀번호가 일치하지 않습니다" (아이디/비밀번호 구분하지 않음)
- 테이블 로그인 실패 시 "테이블 정보가 일치하지 않습니다"
- 보안상 구체적 실패 원인을 노출하지 않음

### BR-AUTH-06: 테이블 세션 자동 생성
- 테이블 로그인 시 활성 세션이 없으면 자동으로 새 세션 생성
- is_active = 1인 세션이 이미 있으면 해당 세션 재사용

---

## 2. 메뉴 검증 규칙

### BR-MENU-01: 필수 필드
| 필드 | 필수 | 검증 |
|------|------|------|
| name | Y | 빈 문자열 불가, 최대 100자 |
| price | Y | 정수, 0 이상 |
| category_id | Y | 존재하는 카테고리 ID |
| description | N | 최대 500자 |
| image_url | N | 빈 문자열 허용 |

### BR-MENU-02: 가격 범위
- 최소: 0원 (무료 메뉴 가능)
- 최대: 제한 없음 (DB CHECK 제약: price >= 0)
- 단위: 원 (정수)

### BR-MENU-03: 메뉴명 중복
- **범위**: 같은 카테고리 내에서 중복 불가
- **조건**: is_available = 1인 메뉴만 대상 (소프트 삭제된 메뉴 제외)
- 다른 카테고리에서는 동일 이름 허용

### BR-MENU-04: 메뉴 삭제 방식
- **소프트 삭제**: is_available = 0으로 변경
- 기존 주문의 order_items에는 menu_name이 이미 저장되어 있어 영향 없음
- 관리자 메뉴 관리에서는 is_available = 0 메뉴도 표시 (비활성 표시)
- 고객 메뉴 조회에서는 is_available = 1만 표시

### BR-MENU-05: 메뉴 순서 조정
- **방식**: 위/아래 화살표 (한 칸씩 이동)
- **동작**: 인접 메뉴와 display_order 값 교환
- **범위**: 같은 카테고리 내에서만
- **경계**: 첫 번째 메뉴 위로 이동 불가, 마지막 메뉴 아래로 이동 불가

### BR-MENU-06: 신규 메뉴 display_order
- 해당 카테고리 내 최대 display_order + 1 (맨 뒤에 추가)

---

## 3. 카테고리 검증 규칙

### BR-CAT-01: 필수 필드
| 필드 | 필수 | 검증 |
|------|------|------|
| name | Y | 빈 문자열 불가, 최대 50자 |

### BR-CAT-02: 카테고리 삭제 조건
- 해당 카테고리에 메뉴가 존재하면 삭제 불가 (is_available 무관, 전체 메뉴 카운트)
- 메뉴를 먼저 다른 카테고리로 이동하거나 삭제 후 카테고리 삭제 가능

---

## 4. API 응답 규칙

### BR-API-01: 성공 응답 형식
```json
{
  "data": { ... }
}
```

### BR-API-02: 에러 응답 형식
```json
{
  "error": {
    "message": "에러 메시지",
    "code": "ERROR_CODE"
  }
}
```

### BR-API-03: HTTP 상태 코드
| 상황 | 코드 | code |
|------|------|------|
| 성공 | 200 | - |
| 생성 성공 | 201 | - |
| 삭제 성공 | 204 | - |
| 검증 실패 | 400 | VALIDATION_ERROR |
| 인증 실패 | 401 | UNAUTHORIZED |
| 권한 없음 | 403 | FORBIDDEN |
| 리소스 없음 | 404 | NOT_FOUND |
| 중복 | 409 | CONFLICT |
| 요청 제한 | 429 | TOO_MANY_REQUESTS |

### BR-API-04: 인증 요구사항
| 엔드포인트 | 인증 |
|-----------|------|
| POST /api/auth/admin/login | 없음 (rateLimiter 적용) |
| POST /api/auth/table/login | 없음 (rateLimiter 적용) |
| POST /api/auth/verify | Bearer 토큰 (admin 또는 table) |
| GET /api/menus | tableAuthMiddleware |
| GET /api/menus/:id | tableAuthMiddleware |
| POST /api/menus | authMiddleware (admin) |
| PUT /api/menus/:id | authMiddleware (admin) |
| DELETE /api/menus/:id | authMiddleware (admin) |
| PUT /api/menus/:id/order | authMiddleware (admin) |
| GET /api/categories | tableAuthMiddleware |
| POST /api/categories | authMiddleware (admin) |
| PUT /api/categories/:id | authMiddleware (admin) |
| DELETE /api/categories/:id | authMiddleware (admin) |
