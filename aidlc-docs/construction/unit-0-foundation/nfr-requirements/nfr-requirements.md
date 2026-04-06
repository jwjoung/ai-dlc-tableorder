# NFR Requirements - Unit 0: Foundation

---

## 1. 성능 (Performance)

### NFR-P01: API 응답 시간
- 일반 API 요청(CRUD): 200ms 이내 응답
- SSE 이벤트 전파: 주문 생성 후 2초 이내 관리자 화면 반영
- DB 쿼리: 단일 쿼리 50ms 이내

### NFR-P02: 동시 접속
- 목표: 소규모 매장 (테이블 10개 이하)
- 동시 SSE 연결: 최대 10개 (관리자 클라이언트)
- 동시 HTTP 요청: 초당 50건 이내

### NFR-P03: SQLite 최적화
- WAL 모드 활성화 (동시 읽기 성능 향상)
- Foreign Keys 활성화 (데이터 무결성)
- Prepared Statements 사용 (SQL Injection 방지 + 성능)

---

## 2. 보안 (Security)

### NFR-S01: 인증
- JWT 토큰 기반 무상태 인증
- 관리자 토큰 만료: 16시간
- 테이블 토큰 만료: 24시간
- JWT Secret: 환경변수로 관리 (하드코딩 금지)

### NFR-S02: 비밀번호
- bcrypt 해싱 (salt rounds: 10)
- 평문 비밀번호 저장 금지
- 비밀번호 최소 길이: 4자 (MVP)

### NFR-S03: 로그인 보호
- IP 기반 Rate Limiting: 15분 내 10회 실패 시 차단
- 차단 시 429 응답 + 남은 대기 시간 안내
- 로그인 성공 시 카운터 리셋

### NFR-S04: API 보안
- CORS: 허용 Origin 제한 (개발: localhost:5173)
- 모든 관리자 API: JWT 인증 필수
- 모든 고객 API: 테이블 JWT 인증 필수 (로그인 제외)
- Request Body 크기 제한: 1MB

### NFR-S05: 데이터 보안
- SQL Injection 방지: Parameterized Queries 사용
- XSS 방지: React 기본 이스케이핑 활용
- 민감 정보 로깅 금지 (비밀번호, 토큰)

---

## 3. 신뢰성 (Reliability)

### NFR-R01: 에러 처리
- 전역 에러 핸들러로 미처리 에러 캐치
- 구조화된 에러 응답: `{ error: { message, code } }`
- 개발 환경: 스택 트레이스 포함
- 프로덕션: 스택 트레이스 제외, 일반 메시지

### NFR-R02: 데이터 무결성
- Foreign Key 제약 활성화
- 트랜잭션 사용 (주문 생성, 이용 완료 등 다중 테이블 작업)
- 주문 항목에 메뉴명/단가 스냅샷 저장 (메뉴 변경 시 기존 주문 보호)

### NFR-R03: SSE 연결 관리
- 클라이언트 연결 해제 시 자동 정리
- 연결 유지 heartbeat: 30초마다 ping
- 재연결: 클라이언트에서 자동 재연결 (EventSource 기본 동작)

---

## 4. 사용성 (Usability)

### NFR-U01: 터치 인터페이스
- 모든 인터랙티브 요소: 최소 44x44px 터치 타겟
- 버튼 간 최소 간격: 8px
- 시각적 피드백: 탭 시 색상 변경

### NFR-U02: 반응성
- API 호출 중 로딩 인디케이터 표시
- 에러 메시지 3초 표시 후 자동 사라짐
- 성공 피드백 즉시 표시

### NFR-U03: 데이터 지속성
- 장바구니: localStorage 저장 (새로고침 유지)
- 인증 토큰: localStorage 저장 (자동 로그인)
- 토큰 만료 시 자동 로그아웃 + 로그인 페이지 리다이렉트

---

## 5. 유지보수성 (Maintainability)

### NFR-M01: 코드 구조
- Layered Architecture: Routes → Controllers → Services → Repositories
- 관심사 분리: 비즈니스 로직은 Service에만 집중
- 환경변수로 설정 관리 (PORT, JWT_SECRET, DB_PATH)

### NFR-M02: 로깅
- 서버 시작/종료 로그
- API 요청 로그 (method, url, status, duration)
- 에러 로그 (스택 트레이스 포함)
- console.log 기반 (MVP, 추후 winston 등 도입 가능)
