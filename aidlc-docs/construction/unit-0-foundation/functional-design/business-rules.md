# Business Rules - Unit 0: Foundation

---

## 1. 미들웨어 규칙

### 1.1 authMiddleware (관리자 인증)
- JWT 토큰은 `Authorization: Bearer {token}` 헤더에서 추출
- 토큰이 없거나 유효하지 않으면 401 Unauthorized 응답
- 토큰 만료 시 401 응답 (16시간 만료)
- 검증 성공 시 `req.admin` 객체에 { id, storeId, username } 설정

### 1.2 tableAuthMiddleware (테이블 인증)
- JWT 토큰은 `Authorization: Bearer {token}` 헤더에서 추출
- 토큰이 없거나 유효하지 않으면 401 Unauthorized 응답
- 검증 성공 시 `req.table` 객체에 { id, storeId, tableNumber, sessionId } 설정

### 1.3 rateLimiter (로그인 시도 제한)
- IP 기반 제한: 동일 IP에서 15분 내 10회 초과 로그인 실패 시 차단
- 차단 시 429 Too Many Requests 응답
- 성공 로그인 시 해당 IP 실패 카운터 리셋
- 메모리 기반 저장 (Map)
- 서버 재시작 시 리셋 (MVP 수준)

### 1.4 errorHandler (전역 에러 핸들링)
- 모든 미처리 에러를 캐치
- 응답 형식: `{ error: { message, code } }`
- 개발 환경: 스택 트레이스 포함
- 프로덕션 환경: 스택 트레이스 제외
- HTTP 상태 코드: 에러 객체에 statusCode가 있으면 사용, 없으면 500

---

## 2. JWT 토큰 규칙

### 2.1 관리자 토큰
- **Payload**: { id, storeId, username, role: 'admin' }
- **만료**: 16시간
- **Secret**: 환경변수 `JWT_SECRET` (기본값: 개발용 시크릿)

### 2.2 테이블 토큰
- **Payload**: { id, storeId, tableNumber, sessionId, role: 'table' }
- **만료**: 24시간
- **Secret**: 동일 `JWT_SECRET`

---

## 3. 데이터베이스 규칙

### 3.1 SQLite 설정
- WAL 모드 활성화 (동시 읽기 성능)
- Foreign Keys 활성화 (`PRAGMA foreign_keys = ON`)
- 파일 위치: `server/data/database.sqlite`

### 3.2 초기화 순서
1. 데이터베이스 파일 생성 (없으면)
2. PRAGMA 설정
3. 스키마 실행 (CREATE TABLE IF NOT EXISTS)
4. Seed 데이터 삽입 (데이터 없을 때만)

---

## 4. API 공통 규칙

### 4.1 응답 형식
- **성공**: `{ data: {...} }` 또는 `{ data: [...] }`
- **에러**: `{ error: { message: "...", code: "..." } }`

### 4.2 CORS
- 개발 환경: `http://localhost:5173` (Vite 기본 포트) 허용
- `credentials: true` 설정

### 4.3 요청 파싱
- `express.json()` - JSON 본문 파싱
- 최대 본문 크기: 1MB

---

## 5. 프론트엔드 공통 규칙

### 5.1 API 클라이언트
- Base URL: 환경변수 또는 `/api` (Vite proxy)
- JWT 토큰: localStorage에서 읽어 Authorization 헤더 자동 첨부
- 401 응답 시: localStorage 토큰 제거, 로그인 페이지로 리다이렉트
- 네트워크 에러 시: 에러 메시지 표시

### 5.2 Vite Proxy 설정
- `/api` → `http://localhost:3000/api` (Express 서버로 프록시)

### 5.3 공통 UI 규칙
- 모든 버튼: 최소 44x44px 터치 타겟
- Modal: 배경 오버레이 클릭 시 닫기
- Loading: API 호출 중 표시
- ErrorMessage: 빨간색 텍스트, 3초 후 자동 사라짐 또는 수동 닫기
