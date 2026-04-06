# NFR Requirements - Unit 1: 인증+메뉴

> Unit 0 Foundation NFR을 상속하며, Unit 1 도메인 특화 NFR을 추가 정의합니다.

---

## 1. 성능 (Performance)

### NFR-U1-P01: 인증 API 응답 시간
- 로그인 API (admin/table): 500ms 이내 (bcrypt 비교 포함)
- 토큰 검증 API: 50ms 이내
- bcrypt는 동기식이지만 salt rounds=10에서 100ms 내외로 허용 범위

### NFR-U1-P02: 메뉴 조회 성능
- 메뉴 전체 조회 (카테고리별 그룹): 200ms 이내
- 메뉴 10~50개 규모에서 최적화 불필요
- JOIN 쿼리 사용 (N+1 방지)

---

## 2. 보안 (Security)

### NFR-U1-S01: 인증 토큰 관리
- 관리자 JWT 만료: 16시간 (Unit 0 기준)
- 테이블 JWT 만료: 24시간 (FD 결정)
- JWT Secret은 환경변수(JWT_SECRET)에서 로드
- 토큰에 민감 정보(비밀번호) 포함 금지

### NFR-U1-S02: 비밀번호 보안
- bcryptjs 사용 (salt rounds: 10)
- 로그인 실패 메시지에 구체적 실패 원인 노출 금지
- 로그에 비밀번호 평문 기록 금지

### NFR-U1-S03: 엔드포인트 인가
- 메뉴 조회 (GET): tableAuthMiddleware (고객 인증)
- 메뉴 CUD (POST/PUT/DELETE): authMiddleware (관리자 인증)
- 카테고리 조회 (GET): tableAuthMiddleware
- 카테고리 CUD: authMiddleware
- 로그인 엔드포인트: rateLimiter만 적용

### NFR-U1-S04: 로그인 보호
- Unit 0 rateLimiter 재사용 (15분/10회)
- 관리자/테이블 로그인 모두에 적용
- 성공 시 카운터 리셋

---

## 3. 신뢰성 (Reliability)

### NFR-U1-R01: 세션 관리
- 테이블 로그인 시 활성 세션 자동 생성 (FD 결정)
- 하나의 테이블에 하나의 활성 세션만 존재
- 세션 생성은 테이블 로그인 시에만 발생

### NFR-U1-R02: 데이터 무결성
- 메뉴 소프트 삭제 (is_available=0, 하드 삭제 아님)
- 카테고리 삭제 전 메뉴 존재 확인 (삭제 차단)
- 메뉴 순서 교환은 트랜잭션으로 원자성 보장

---

## 4. 사용성 (Usability)

### NFR-U1-U01: 자동 로그인 UX
- localStorage에 저장된 정보로 자동 로그인 시도
- 실패 시 즉시 SetupPage로 이동, 에러 메시지 표시
- 자동 로그인 중 로딩 인디케이터 표시

### NFR-U1-U02: 메뉴 탐색 UX
- 카테고리 탭 가로 스크롤 지원
- 메뉴 카드 그리드 2열 레이아웃
- 메뉴 상세 모달 (현재 목록 유지)
- 장바구니 추가: 카드 + 버튼 및 상세 모달 모두 가능

### NFR-U1-U03: 관리자 메뉴 관리 UX
- 사이드바(카테고리) + 메인(메뉴 목록) 레이아웃
- 순서 조정: 위/아래 화살표 버튼
- 삭제 전 확인 팝업 필수
- 성공/실패 피드백 즉시 표시

---

## 5. 유지보수성 (Maintainability)

### NFR-U1-M01: 레이어드 아키텍처
- Routes → Controllers → Services → Repositories 패턴 준수
- Controller: HTTP 요청/응답 처리만
- Service: 비즈니스 로직 집중
- Repository: 데이터 접근만 (SQL 쿼리)

### NFR-U1-M02: 에러 처리 패턴
- Service에서 AppError 던지기
- Controller에서 try-catch → next(error)
- errorHandler 미들웨어에서 통합 처리
